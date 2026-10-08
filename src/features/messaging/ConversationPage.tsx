'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getConversationThread, markConversationRead } from './api/conversationAPI';
import { sendMessage } from './api/messagingAPI';
import { ApiError } from '@/lib/api/client';
import { getMe } from '@/features/auth/api/authApi';
import type { ThreadMessage, ConversationDetail } from './api/conversationAPI';

const JOB_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  bidding:   { bg: '#fff7ed', text: '#d93506' },
  booked:    { bg: '#d1fae5', text: '#065f46' },
  completed: { bg: '#f0fdf4', text: '#15803d' },
  open:      { bg: '#e0f2fe', text: '#0369a1' },
  active:    { bg: '#e0f2fe', text: '#0369a1' },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function groupByDay(messages: ThreadMessage[]) {
  const groups: { day: string; messages: ThreadMessage[] }[] = [];
  messages.forEach((m) => {
    const day = new Date(m.sent_at).toDateString();
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.messages.push(m);
    else groups.push({ day, messages: [m] });
  });
  return groups;
}

// Skeleton shown while the thread first loads
function ThreadSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto rounded-2xl border border-[#e8e0d6] bg-white p-4 space-y-4 animate-pulse" aria-busy="true" aria-label="Loading messages">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className={`h-10 rounded-2xl bg-neutral-100 ${i % 2 === 0 ? 'w-48' : 'w-64'}`} />
        </div>
      ))}
    </div>
  );
}

interface Props {
  conversationId: string;
}

export default function ConversationPage({ conversationId }: Props) {
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  // oldest message id for cursor pagination
  const [oldestMessageId, setOldestMessageId] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  // Load the initial thread page
  const loadThread = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [data, me] = await Promise.all([
        getConversationThread(conversationId),
        getMe(),
      ]);
      setConversation(data.conversation);
      setMessages(data.messages);
      setCurrentUserId(me.data.id);
      setCurrentUserName(me.data.name);
      setHasMore(data.messages.length === 30);
      setOldestMessageId(data.messages[0]?.id);
      markConversationRead(conversationId).catch(() => undefined);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Failed to load conversation.');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => { loadThread(); }, [loadThread]);

  // Scroll to bottom on initial load and after new messages
  useEffect(() => {
    if (!loading) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [loading, messages.length]);

  // Load older messages (cursor paginate backwards)
  async function loadOlderMessages() {
    if (!oldestMessageId || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const prevScrollHeight = threadRef.current?.scrollHeight ?? 0;
      const data = await getConversationThread(conversationId, oldestMessageId);
      setMessages((prev) => [...data.messages, ...prev]);
      setHasMore(data.messages.length === 30);
      setOldestMessageId(data.messages[0]?.id);
      // Restore scroll position so the user stays at the same spot
      requestAnimationFrame(() => {
        if (threadRef.current) {
          threadRef.current.scrollTop = threadRef.current.scrollHeight - prevScrollHeight;
        }
      });
    } catch {
      // Silently fail — user can retry by scrolling up again
    } finally {
      setLoadingOlder(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() && attachments.length === 0) return;
    setSendError(null);

    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimistic: ThreadMessage = {
      id: tempId,
      sender_id: currentUserId ?? '',
      sender_name: currentUserName ?? 'You',
      body: input.trim(),
      attachments: attachments.map((f) => ({ id: tempId, name: f.name, url: '#', size: f.size })),
      sent_at: new Date().toISOString(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, optimistic]);
    const sentBody = input.trim();
    const sentFiles = attachments;
    setInput('');
    setAttachments([]);
    setSending(true);

    try {
      const result = await sendMessage({
        conversation_id: conversationId,
        body: sentBody || undefined,
        attachments: sentFiles.length ? sentFiles : undefined,
      });
      // Replace optimistic entry with confirmed message from server
      const confirmed: ThreadMessage = {
        ...result.message,
        status: 'sent',
      };
      setMessages((prev) => prev.map((m) => m.id === tempId ? confirmed : m));
    } catch (err) {
      setMessages((prev) => prev.map((m) => m.id === tempId ? { ...m, status: 'error' } : m));
      setSendError(err instanceof ApiError ? err.message : 'Failed to send message.');
    } finally {
      setSending(false);
    }
  }

  // ─── Derived ───────────────────────────────────────────────────────────────
  const job = conversation?.job ?? null;
  const counterparty = conversation?.counterparty;
  const jobStyle = job?.status ? (JOB_STATUS_STYLES[job.status] ?? { bg: '#f5f5f5', text: '#737373' }) : null;
  const grouped = groupByDay(messages);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto flex max-w-[800px] flex-col px-6 py-8" style={{ height: 'calc(100vh - 120px)', minHeight: 600 }}>

      {/* Back */}
      <Link href="/messages" className="mb-4 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Inbox
      </Link>

      {/* Load error */}
      {loadError && (
        <div className="mb-4 shrink-0 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-600" role="alert">
          {loadError}
          <button onClick={loadThread} className="ml-3 font-semibold underline hover:text-red-800">Retry</button>
        </div>
      )}

      {/* Job summary card */}
      {conversation && (
        <div className="mb-4 shrink-0 rounded-2xl border border-[#e8e0d6] bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: '#2b1508' }} aria-hidden="true">
                {counterparty?.company_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">{counterparty?.company_name}</p>
                <p className="text-xs capitalize text-neutral-400">{counterparty?.role}</p>
              </div>
            </div>
            {job && (
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="text-xs font-mono text-neutral-400">{job.job_id}</p>
                  <p className="text-xs text-neutral-600">{job.origin} → {job.destination}</p>
                </div>
                {jobStyle && (
                  <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px]" style={{ background: jobStyle.bg, color: jobStyle.text }}>
                    {job.status}
                  </span>
                )}
                <Link href={`/marketplace/loads/${job.load_id}`} className="text-xs font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">
                  View job →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thread */}
      {loading ? (
        <ThreadSkeleton />
      ) : (
        <div ref={threadRef} className="flex-1 overflow-y-auto rounded-2xl border border-[#e8e0d6] bg-white p-4" aria-live="polite" aria-label="Message thread">
          {/* Load older messages */}
          {hasMore && (
            <div className="mb-4 flex justify-center">
              <button
                type="button"
                onClick={loadOlderMessages}
                disabled={loadingOlder}
                className="rounded-full border border-[#e0d5c8] bg-white px-4 py-1.5 text-xs text-neutral-500 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07] disabled:opacity-50"
              >
                {loadingOlder ? 'Loading…' : 'Load older messages'}
              </button>
            </div>
          )}

          {messages.length === 0 && !loading && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm text-neutral-400">No messages yet. Send the first one below.</p>
            </div>
          )}

          {grouped.map((group) => (
            <div key={group.day}>
              {/* Day separator */}
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#f0ece6]" />
                <span className="text-[11px] text-neutral-400">{formatDay(group.messages[0].sent_at)}</span>
                <div className="h-px flex-1 bg-[#f0ece6]" />
              </div>

              {group.messages.map((m) => {
                const isMe = (currentUserName !== null && m.sender_name === currentUserName) || m.status === 'sending' || m.status === 'error';
                return (
                  <div key={m.id} className={`mb-4 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      {!isMe && <p className="text-[11px] font-medium text-neutral-500">{m.sender_name}</p>}
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isMe ? 'rounded-tr-sm text-white' : 'rounded-tl-sm border border-[#f0ece6] bg-[#fafaf8] text-neutral-800'}`}
                        style={{ background: isMe ? '#fc3f07' : undefined }}
                      >
                        {m.body}
                        {m.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {m.attachments.map((a) => (
                              <a key={a.id} href={a.url} className={`flex items-center gap-1.5 text-xs underline underline-offset-2 ${isMe ? 'text-white/80 hover:text-white' : 'text-[#fc3f07] hover:text-[#d93506]'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                {a.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-neutral-400">{formatTime(m.sent_at)}</span>
                        {isMe && m.status === 'sending' && <span className="text-[10px] text-neutral-400">Sending…</span>}
                        {isMe && m.status === 'error' && <span className="text-[10px] text-red-400">Failed to send</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Compose */}
      <div className="mt-3 shrink-0 rounded-2xl border border-[#e8e0d6] bg-white p-3 shadow-sm">
        {sendError && (
          <p className="mb-2 text-xs text-red-500" role="alert">{sendError}</p>
        )}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded-lg border border-[#e0d5c8] bg-[#fafaf8] px-2.5 py-1 text-xs text-neutral-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#fc3f07]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {f.name}
                <button type="button" onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))} className="ml-0.5 text-neutral-400 hover:text-red-500" aria-label={`Remove ${f.name}`}>×</button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <input
            type="file"
            ref={fileRef}
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            className="sr-only"
            aria-hidden="true"
            onChange={(e) => { if (e.target.files) setAttachments((p) => [...p, ...Array.from(e.target.files!)]); e.target.value = ''; }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e0d5c8] text-neutral-400 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
            aria-label="Attach file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as unknown as React.FormEvent); } }}
            placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-[#e0d5c8] bg-[#fafaf8] px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20"
            style={{ maxHeight: 120, overflowY: 'auto' }}
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={sending || (!input.trim() && attachments.length === 0)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition-colors disabled:opacity-50 hover:enabled:bg-[#d93506]"
            style={{ background: '#fc3f07' }}
            aria-label="Send message"
          >
            {sending
              ? <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>}
          </button>
        </form>
        {job && (
          <p className="mt-2 text-[10px] text-neutral-400">Messages stay on-platform and are tied to job {job.job_id}.</p>
        )}
      </div>

    </div>
  );
}

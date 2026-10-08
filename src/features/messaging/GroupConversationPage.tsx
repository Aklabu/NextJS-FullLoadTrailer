'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ROLE_COLORS, ROLE_LABELS } from './groupTypes';
import { getCommunityHistory, sendCommunityMessage } from './api/groupMessagingAPI';
import type { CommunityMessage, CommunityAttachment } from './api/groupMessagingAPI';
import { createCommunitySocket } from './api/wsMessagingAPI';
import type { WsStatus } from './api/wsMessagingAPI';
import { getMe } from '@/features/auth/api/authApi';
import { ApiError } from '@/lib/api/client';

const WS_STATUS_STYLES: Record<WsStatus, { color: string; label: string }> = {
  connecting: { color: '#f59e0b', label: 'Connecting…' },
  open:       { color: '#22c55e', label: 'Live' },
  closed:     { color: '#9ca3af', label: 'Disconnected' },
  error:      { color: '#ef4444', label: 'Connection error' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDay(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function groupByDay(messages: CommunityMessage[]) {
  const groups: { day: string; messages: CommunityMessage[] }[] = [];
  messages.forEach((m) => {
    const day = new Date(m.sent_at).toDateString();
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.messages.push(m);
    else groups.push({ day, messages: [m] });
  });
  return groups;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Avatar({ name, role }: { name: string; role: string }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
      style={{ background: ROLE_COLORS[role] ?? '#6b7280' }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function StagedFile({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isImage = file.type.startsWith('image/');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isImage) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  return (
    <div className="relative flex items-center gap-2 rounded-lg border border-[#e0d5c8] bg-white px-3 py-1.5 text-xs">
      {isImage && preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={file.name} className="h-7 w-7 rounded object-cover" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
      <span className="max-w-[100px] truncate text-neutral-600">{file.name}</span>
      <span className="text-neutral-400">{formatFileSize(file.size)}</span>
      <button type="button" onClick={onRemove} className="ml-1 text-neutral-400 transition-colors hover:text-red-500" aria-label={`Remove ${file.name}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

function AttachmentView({ att, isMe }: { att: CommunityAttachment; isMe: boolean }) {
  if (att.type === 'image') {
    return (
      <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="block">
        <Image src={att.url} alt={att.name} width={220} height={148} className="rounded-lg object-cover" style={{ maxWidth: 220 }} />
        <span className={`mt-1 block text-[10px] ${isMe ? 'text-white/70' : 'text-neutral-400'}`}>{att.name}</span>
      </a>
    );
  }
  return (
    <a
      href={att.url}
      className={`flex items-center gap-1.5 text-xs underline underline-offset-2 ${isMe ? 'text-white/80 hover:text-white' : 'text-[#fc3f07] hover:text-[#d93506]'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
      {att.name}
      <span className={`${isMe ? 'text-white/50' : 'text-neutral-400'}`}>({formatFileSize(att.size)})</span>
    </a>
  );
}

function MessageBubble({ message, isMe }: { message: CommunityMessage; isMe: boolean }) {
  return (
    <div className={`mb-4 flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isMe && <Avatar name={message.sender_name} role={message.sender_role} />}

      <div className={`flex max-w-[78%] flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && (
          <div className="flex items-baseline gap-2">
            <span className="text-[12px] font-semibold text-neutral-700">{message.sender_name}</span>
            <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white" style={{ background: ROLE_COLORS[message.sender_role] ?? '#6b7280' }}>
              {ROLE_LABELS[message.sender_role]}
            </span>
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isMe ? 'rounded-tr-sm text-white' : 'rounded-tl-sm border border-[#f0ece6] bg-[#fafaf8] text-neutral-800'}`}
          style={{ background: isMe ? '#fc3f07' : undefined }}
        >
          {message.body && <p>{message.body}</p>}

          {message.attachments.length > 0 && (
            <div className={`${message.body ? 'mt-2' : ''} space-y-2`}>
              {message.attachments.map((att) => (
                <AttachmentView key={att.id} att={att} isMe={isMe} />
              ))}
            </div>
          )}

          {message.status === 'error' && (
            <p className="mt-1 text-[10px] text-red-300">Failed to send</p>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-neutral-400">{formatTime(message.sent_at)}</span>
          {isMe && message.status === 'sending' && <span className="text-[10px] text-neutral-400">Sending…</span>}
        </div>
      </div>
    </div>
  );
}

function ThreadSkeleton() {
  return (
    <div className="space-y-4 animate-pulse p-4" aria-busy="true" aria-label="Loading messages">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`flex gap-2.5 ${i % 3 === 0 ? 'flex-row-reverse' : ''}`}>
          <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-200" />
          <div className={`space-y-1.5 ${i % 3 === 0 ? 'items-end flex flex-col' : ''}`}>
            <div className="h-3 w-24 rounded bg-neutral-200" />
            <div className={`h-10 rounded-2xl bg-neutral-100 ${i % 2 === 0 ? 'w-56' : 'w-72'}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GroupConversationPage() {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [oldestId, setOldestId] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);

  // Current user's company name — used for isMe check (same approach as ConversationPage)
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  const [input, setInput] = useState('');
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [wsStatus, setWsStatus] = useState<WsStatus>('connecting');

  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<ReturnType<typeof createCommunitySocket> | null>(null);
  const messageIdsRef = useRef<Set<string>>(new Set());

  // Load history + current user in parallel on mount
  const loadHistory = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [data, me] = await Promise.all([
        getCommunityHistory(),
        getMe(),
      ]);
      setMessages(data.messages);
      setHasMore(data.has_more);
      setOldestId(data.oldest_id);
      setCurrentUserName(me.data.name);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Failed to load community chat.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  // Open WS once REST history is loaded
  useEffect(() => {
    if (loading) return;
    setWsStatus('connecting');
    const socket = createCommunitySocket({
      onOpen:  () => setWsStatus('open'),
      onClose: () => setWsStatus('closed'),
      onError: () => setWsStatus('error'),
      onMessage: (msg) => {
        if (messageIdsRef.current.has(msg.id)) return;
        messageIdsRef.current.add(msg.id);
        setMessages((prev) => [...prev, {
          id: msg.id,
          sender_id: msg.sender_id,
          sender_name: msg.sender_name,
          sender_role: msg.sender_role,
          body: msg.body,
          attachments: msg.attachments,
          sent_at: msg.sent_at,
          status: 'sent',
        }]);
      },
    });
    socketRef.current = socket;
    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [loading]);

  // Keep dedup set in sync
  useEffect(() => {
    messageIdsRef.current = new Set(messages.map((m) => m.id));
  }, [messages]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!loading) bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [loading]);

  // Scroll to bottom when new messages arrive (but not when loading older ones)
  useEffect(() => {
    if (!loading && !loadingOlder) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, loading, loadingOlder]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  async function loadOlderMessages() {
    if (!oldestId || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const prevScrollHeight = threadRef.current?.scrollHeight ?? 0;
      const data = await getCommunityHistory({ beforeMessageId: oldestId });
      setMessages((prev) => [...data.messages, ...prev]);
      setHasMore(data.has_more);
      setOldestId(data.oldest_id);
      requestAnimationFrame(() => {
        if (threadRef.current) {
          threadRef.current.scrollTop = threadRef.current.scrollHeight - prevScrollHeight;
        }
      });
    } catch {
      // Non-critical — user can scroll up again to retry
    } finally {
      setLoadingOlder(false);
    }
  }

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setStagedFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  }, []);

  const removeFile = useCallback((index: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() && stagedFiles.length === 0) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic: CommunityMessage = {
      id: tempId,
      sender_id: 'me',
      sender_name: currentUserName ?? 'You',
      sender_role: 'carrier',
      body: input.trim(),
      attachments: stagedFiles.map((f, i) => ({
        id: `att-${tempId}-${i}`,
        name: f.name,
        url: URL.createObjectURL(f),
        size: f.size,
        type: f.type.startsWith('image/') ? 'image' as const : 'file' as const,
      })),
      sent_at: new Date().toISOString(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, optimistic]);
    const sentBody = input.trim();
    const sentFiles = stagedFiles;
    setInput('');
    setStagedFiles([]);
    setSending(true);

    // Text-only + WS open → send over WS (no round-trip)
    // Files always use REST — WS cannot carry binary payloads
    const useWs = sentFiles.length === 0 && socketRef.current?.getStatus() === 'open';

    if (useWs) {
      try {
        socketRef.current!.send(sentBody);
        // Server broadcasts back; WS onMessage will dedup. Mark optimistic sent for UX.
        setMessages((prev) => prev.map((m) => m.id === tempId ? { ...m, status: 'sent' as const } : m));
      } catch {
        setMessages((prev) => prev.map((m) => m.id === tempId ? { ...m, status: 'error' as const } : m));
      } finally {
        setSending(false);
      }
    } else {
      try {
        const confirmed = await sendCommunityMessage({
          body: sentBody || undefined,
          attachments: sentFiles.length ? sentFiles : undefined,
        });
        // Pre-register confirmed id before WS broadcast arrives
        messageIdsRef.current.add(confirmed.id);
        setMessages((prev) => prev.map((m) => m.id === tempId ? confirmed : m));
      } catch {
        setMessages((prev) => prev.map((m) => m.id === tempId ? { ...m, status: 'error' as const } : m));
      } finally {
        setSending(false);
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as React.FormEvent);
    }
  }

  const grouped = groupByDay(messages);
  const wsStyle = WS_STATUS_STYLES[wsStatus];

  return (
    <div className="mx-auto flex max-w-[860px] flex-col px-4 sm:px-6" style={{ height: 'calc(100vh - 80px)', minHeight: 560 }}>

      {/* Header */}
      <div className="shrink-0 py-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#e8e0d6] bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">💬</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-semibold text-neutral-800">Community Chat</h1>
                <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
                  Tier 1 · Free
                </span>
                <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
                  All roles welcome
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500">
                One industry-wide chat — shippers, brokers, and carriers. Share loads, ask questions, stay connected.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {Object.entries(ROLE_LABELS).map(([role, label]) => (
              <span key={role} className="flex items-center gap-1 text-[10px] text-neutral-500">
                <span className="h-2 w-2 rounded-full" style={{ background: ROLE_COLORS[role] }} aria-hidden="true" />
                {label}
              </span>
            ))}
            {/* WS connection indicator */}
            {!loading && (
              <span className="flex items-center border-l border-[#e8e0d6] pl-3" title={wsStyle.label}>
                <span className={`h-2 w-2 rounded-full ${wsStatus === 'open' ? 'animate-pulse' : ''}`} style={{ background: wsStyle.color }} aria-label={wsStyle.label} />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Thread */}
      {loading ? (
        <div className="flex-1 overflow-hidden rounded-2xl border border-[#e8e0d6] bg-white">
          <ThreadSkeleton />
        </div>
      ) : loadError ? (
        <div className="flex-1 flex items-center justify-center rounded-2xl border border-red-100 bg-red-50">
          <div className="text-center px-6 py-10">
            <p className="text-sm text-red-600">{loadError}</p>
            <button onClick={loadHistory} className="mt-3 text-sm font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">Retry</button>
          </div>
        </div>
      ) : (
        <div ref={threadRef} className="flex-1 overflow-y-auto rounded-2xl border border-[#e8e0d6] bg-white p-4" aria-live="polite" aria-label="Community chat messages">

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

          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center py-16">
              <span className="mb-3 text-4xl" aria-hidden="true">💬</span>
              <p className="text-sm font-medium text-neutral-600">No messages yet.</p>
              <p className="mt-1 text-xs text-neutral-400">Be the first to say something to the community!</p>
            </div>
          )}

          {grouped.map((group) => (
            <div key={group.day}>
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#f0ece6]" />
                <span className="text-[11px] text-neutral-400">{formatDay(group.messages[0].sent_at)}</span>
                <div className="h-px flex-1 bg-[#f0ece6]" />
              </div>
              {group.messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isMe={currentUserName !== null && m.sender_name === currentUserName}
                />
              ))}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Staged file previews */}
      {stagedFiles.length > 0 && (
        <div className="shrink-0 flex flex-wrap gap-2 px-1 pt-3">
          {stagedFiles.map((f, i) => (
            <StagedFile key={`${f.name}-${i}`} file={f} onRemove={() => removeFile(i)} />
          ))}
        </div>
      )}

      {/* Compose bar */}
      <form onSubmit={handleSend} className="shrink-0 pb-4 pt-3" aria-label="Send a message">
        <div className="flex items-end gap-2 rounded-2xl border border-[#e0d5c8] bg-white px-3 py-2.5 shadow-sm focus-within:border-[#fc3f07] focus-within:ring-2 focus-within:ring-[#fc3f07]/20 transition-all">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mb-0.5 shrink-0 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-[#fff7ed] hover:text-[#fc3f07]"
            aria-label="Attach file or image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" className="hidden" onChange={handleFileChange} aria-hidden="true" tabIndex={-1} />

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message the community… (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none leading-relaxed"
            style={{ minHeight: 24, maxHeight: 120 }}
            aria-label="Message input"
          />

          <button
            type="submit"
            disabled={sending || (!input.trim() && stagedFiles.length === 0)}
            className="mb-0.5 shrink-0 rounded-xl px-3 py-1.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: '#fc3f07' }}
            aria-label="Send message"
          >
            {sending ? (
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-neutral-400">Be respectful · No spam · Keep it industry-related</p>
      </form>
    </div>
  );
}

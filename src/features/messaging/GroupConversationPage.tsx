'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { GroupMessage, GroupMessageAttachment } from './groupTypes';
import { ROLE_COLORS, ROLE_LABELS } from './groupTypes';

// Mock current user — replace with real AuthUser from session context
const MOCK_ME = { id: 'me', companyName: 'FastHaul LLC', role: 'carrier' as const };

const MOCK_MESSAGES: GroupMessage[] = [
  {
    id: 'gm1', senderId: 'u1', senderName: 'Acme Freight LLC', senderRole: 'shipper',
    body: 'Hey everyone! Anyone have a dry van available Chicago to Detroit next Thursday? ~800 cu ft.',
    attachments: [], sentAt: '2026-09-24T09:00:00Z', status: 'sent',
  },
  {
    id: 'gm2', senderId: 'u2', senderName: 'BridgeLogistics', senderRole: 'broker',
    body: 'We have a carrier partner who might be able to help. What\'s the weight?',
    attachments: [], sentAt: '2026-09-24T09:05:00Z', status: 'sent',
  },
  {
    id: 'gm3', senderId: 'u3', senderName: 'MidWest Movers', senderRole: 'carrier',
    body: 'We run that lane weekly. DM me for details.',
    attachments: [{ id: 'a1', name: 'lane-schedule.pdf', url: '#', type: 'file', size: 124000 }],
    sentAt: '2026-09-24T09:12:00Z', status: 'sent',
  },
  {
    id: 'gm4', senderId: 'u4', senderName: 'Desert Logistics', senderRole: 'shipper',
    body: 'Anyone dealt with a damage claim on electronics recently? This is taking forever.',
    attachments: [{ id: 'a2', name: 'damage-photo.jpg', url: '/images/homepage/homepage-truck.png', type: 'image', size: 340000 }],
    sentAt: '2026-09-24T10:30:00Z', status: 'sent',
  },
  {
    id: 'gm5', senderId: 'u5', senderName: 'Atlas Freight Partners', senderRole: 'broker',
    body: 'Unfortunately normal. Usually 30-45 days with standard carriers.',
    attachments: [], sentAt: '2026-09-24T10:35:00Z', status: 'sent',
  },
];

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

function groupByDay(messages: GroupMessage[]) {
  const groups: { day: string; messages: GroupMessage[] }[] = [];
  messages.forEach((m) => {
    const day = new Date(m.sentAt).toDateString();
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.messages.push(m);
    else groups.push({ day, messages: [m] });
  });
  return groups;
}

function formatFileSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 text-neutral-400 transition-colors hover:text-red-500"
        aria-label={`Remove ${file.name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

function MessageBubble({ message, isMe }: { message: GroupMessage; isMe: boolean }) {
  return (
    <div className={`mb-4 flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isMe && <Avatar name={message.senderName} role={message.senderRole} />}

      <div className={`flex max-w-[78%] flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Sender label — only on other people's messages */}
        {!isMe && (
          <div className="flex items-baseline gap-2">
            <span className="text-[12px] font-semibold text-neutral-700">{message.senderName}</span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white"
              style={{ background: ROLE_COLORS[message.senderRole] ?? '#6b7280' }}
            >
              {ROLE_LABELS[message.senderRole]}
            </span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isMe
              ? 'rounded-tr-sm text-white'
              : 'rounded-tl-sm border border-[#f0ece6] bg-[#fafaf8] text-neutral-800'
          }`}
          style={{ background: isMe ? '#fc3f07' : undefined }}
        >
          {message.body && <p>{message.body}</p>}

          {message.attachments.length > 0 && (
            <div className={`${message.body ? 'mt-2' : ''} space-y-2`}>
              {message.attachments.map((att) => {
                if (att.type === 'image') {
                  return (
                    <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="block">
                      <Image
                        src={att.url}
                        alt={att.name}
                        width={220}
                        height={148}
                        className="rounded-lg object-cover"
                        style={{ maxWidth: 220 }}
                      />
                      <span className={`mt-1 block text-[10px] ${isMe ? 'text-white/70' : 'text-neutral-400'}`}>
                        {att.name}
                      </span>
                    </a>
                  );
                }
                return (
                  <a
                    key={att.id}
                    href={att.url}
                    className={`flex items-center gap-1.5 text-xs underline underline-offset-2 ${
                      isMe ? 'text-white/80 hover:text-white' : 'text-[#fc3f07] hover:text-[#d93506]'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    {att.name}
                    {att.size && (
                      <span className={`${isMe ? 'text-white/50' : 'text-neutral-400'}`}>
                        ({formatFileSize(att.size)})
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          )}

          {message.status === 'error' && (
            <p className="mt-1 text-[10px] text-red-300">Failed to send · Tap to retry</p>
          )}
        </div>

        <span className="text-[10px] text-neutral-400">{formatTime(message.sentAt)}</span>
      </div>
    </div>
  );
}

export default function GroupConversationPage() {
  const [messages, setMessages] = useState<GroupMessage[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

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
    const attachments: GroupMessageAttachment[] = stagedFiles.map((f, i) => ({
      id: `att-${tempId}-${i}`,
      name: f.name,
      url: URL.createObjectURL(f),
      type: f.type.startsWith('image/') ? 'image' : 'file',
      size: f.size,
    }));

    const newMsg: GroupMessage = {
      id: tempId,
      senderId: MOCK_ME.id,
      senderName: MOCK_ME.companyName,
      senderRole: MOCK_ME.role,
      body: input.trim(),
      attachments,
      sentAt: new Date().toISOString(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setStagedFiles([]);
    setSending(true);

    try {
      // TODO: POST /api/community/messages/ with FormData { body, attachments[] }
      await new Promise((r) => setTimeout(r, 500));
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: 'sent' } : m))
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: 'error' } : m))
      );
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as React.FormEvent);
    }
  }

  const grouped = groupByDay(messages);

  return (
    <div
      className="mx-auto flex max-w-[860px] flex-col px-4 sm:px-6"
      style={{ height: 'calc(100vh - 80px)', minHeight: 560 }}
    >
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
          {/* Role legend */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {Object.entries(ROLE_LABELS).map(([role, label]) => (
              <span key={role} className="flex items-center gap-1 text-[10px] text-neutral-500">
                <span className="h-2 w-2 rounded-full" style={{ background: ROLE_COLORS[role] }} aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Message thread */}
      <div
        className="flex-1 overflow-y-auto rounded-2xl border border-[#e8e0d6] bg-white p-4"
        aria-live="polite"
        aria-label="Community chat messages"
      >
        {grouped.map((group) => (
          <div key={group.day}>
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#f0ece6]" />
              <span className="text-[11px] text-neutral-400">{formatDay(group.messages[0].sentAt)}</span>
              <div className="h-px flex-1 bg-[#f0ece6]" />
            </div>
            {group.messages.map((m) => (
              <MessageBubble key={m.id} message={m} isMe={m.senderId === MOCK_ME.id} />
            ))}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

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
          {/* Attach */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mb-0.5 shrink-0 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-[#fff7ed] hover:text-[#fc3f07]"
            aria-label="Attach file or image"
            title="Attach file or image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            className="hidden"
            onChange={handleFileChange}
            aria-hidden="true"
            tabIndex={-1}
          />

          {/* Text */}
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

          {/* Send */}
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
        <p className="mt-1.5 text-center text-[10px] text-neutral-400">
          Be respectful · No spam · Keep it industry-related
        </p>
      </form>
    </div>
  );
}

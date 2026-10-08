'use client';

import { useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendMessage } from './api/messagingAPI';
import { ApiError } from '@/lib/api/client';

// Context labels shown in the banner above the compose form
function contextLabel(params: URLSearchParams): { icon: string; text: string } | null {
  const loadId = params.get('load_id');
  const capacityId = params.get('capacity_id');
  const boardPostId = params.get('board_post_id');
  const jobId = params.get('job_id');

  if (loadId) return { icon: '📦', text: `Re: Load ${jobId ?? loadId}` };
  if (capacityId) return { icon: '🚚', text: `Re: Capacity posting ${capacityId}` };
  if (boardPostId) return { icon: '📋', text: `Re: Board post ${boardPostId}` };
  if (jobId) return { icon: '✅', text: `Re: Booking ${jobId}` };
  return null;
}

export default function NewConversationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const recipientId = searchParams.get('recipient_id') ?? '';
  const recipientName = searchParams.get('recipient_name') ?? recipientId;
  const recipientRole = searchParams.get('recipient_role') ?? '';
  const loadId = searchParams.get('load_id') ?? undefined;
  const capacityId = searchParams.get('capacity_id') ?? undefined;
  const boardPostId = searchParams.get('board_post_id') ?? undefined;

  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const ctx = contextLabel(searchParams);

  // Guard — if no recipient was provided the URL is malformed
  if (!recipientId) {
    return (
      <div className="mx-auto max-w-[560px] px-6 py-16 text-center">
        <p className="text-base font-semibold text-neutral-700">Missing recipient</p>
        <p className="mt-1 text-sm text-neutral-400">This link is missing a recipient. Go back and try again.</p>
        <Link href="/messages" className="mt-5 inline-block text-sm font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">
          ← Back to inbox
        </Link>
      </div>
    );
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() && attachments.length === 0) return;
    setError(null);
    setSubmitting(true);

    try {
      const result = await sendMessage({
        recipient_id: recipientId,
        body: body.trim() || undefined,
        load_id: loadId,
        capacity_id: capacityId,
        board_post_id: boardPostId,
        attachments: attachments.length ? attachments : undefined,
      });
      router.push(`/messages/${result.conversation_id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[600px] px-6 py-10">

      {/* Back */}
      <Link href="/messages" className="mb-6 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Inbox
      </Link>

      {/* Header */}
      <div className="mb-6">
        <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
          <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />
          New Message
        </span>
        <h1 className="mt-1 text-[clamp(20px,3vw,26px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Message {recipientName}
        </h1>
        {recipientRole && (
          <p className="mt-1 text-sm capitalize text-neutral-400">{recipientRole}</p>
        )}
      </div>

      {/* Context banner */}
      {ctx && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#e8c99a] bg-[#fffbf2] px-4 py-3">
          <span aria-hidden="true">{ctx.icon}</span>
          <p className="text-sm font-medium text-[#7a4a1a]">{ctx.text}</p>
        </div>
      )}

      {/* Compose form */}
      <form onSubmit={handleSend} className="rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm">

        {/* To field — read-only display */}
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#e0d5c8] bg-[#fafaf8] px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: '#2b1508' }} aria-hidden="true">
            {recipientName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-800">{recipientName}</p>
            {recipientRole && <p className="text-xs capitalize text-neutral-400">{recipientRole}</p>}
          </div>
        </div>

        {/* Staged attachments */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
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

        {/* Message textarea */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message…"
          rows={6}
          className="w-full resize-none rounded-xl border border-[#e0d5c8] bg-[#fafaf8] px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20"
          aria-label="Message body"
          required={attachments.length === 0}
        />

        {/* Error */}
        {error && (
          <p className="mt-2 text-xs text-red-500" role="alert">{error}</p>
        )}

        {/* Footer actions */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
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
              className="flex items-center gap-1.5 rounded-xl border border-[#e0d5c8] px-3 py-2 text-xs font-medium text-neutral-500 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
              aria-label="Attach file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Attach
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting || (!body.trim() && attachments.length === 0)}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 hover:enabled:bg-[#d93506]"
            style={{ background: '#fc3f07' }}
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending…
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Send Message
              </>
            )}
          </button>
        </div>
      </form>

      <p className="mt-4 text-[11px] text-neutral-400">
        Messages are kept on-platform. Contact details are not shared until both parties agree.
      </p>

    </div>
  );
}

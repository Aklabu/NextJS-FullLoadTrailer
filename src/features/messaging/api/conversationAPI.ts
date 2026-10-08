// Conversation thread API — GET /api/messages/<conversation_id>/
// All endpoints require a valid JWT (handled by apiFetch).

import { apiFetch } from '@/lib/api/client';
import type { MessageAttachment, ConversationCounterparty } from './messagingAPI';

// ─── Types ───────────────────────────────────────────────────────────────────

// Job context pinned to the top of a conversation thread
export interface ConversationJob {
  job_id: string;
  origin: string;
  destination: string;
  pickup_date: string;
  status: string;
  load_id: string;
}

// Full conversation header returned inside the thread response
export interface ConversationDetail {
  id: string;
  job: ConversationJob | null;
  counterparty: ConversationCounterparty;
}

// A single message in the thread — status is broader than SentMessage to support
// optimistic UI states ('sending' / 'error') on the conversation page
export interface ThreadMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  body: string;
  attachments: MessageAttachment[];
  sent_at: string;
  status: 'sent' | 'sending' | 'error';
}

export interface ThreadData {
  conversation: ConversationDetail;
  // Ordered oldest-first within the page. To load older messages pass
  // messages[0].id (the oldest currently loaded) as beforeMessageId.
  messages: ThreadMessage[];
}

interface GetThreadApiResponse {
  status: 'success';
  message: string;
  data: ThreadData;
}

// ─── GET /api/messages/<conversation_id>/ ────────────────────────────────────

// Fetch the full message thread for a conversation (30 messages per page).
// Pass beforeMessageId to cursor-paginate backwards and load older messages.
//
// Throws ApiError on:
//   403 — caller is not a participant in this conversation
//   404 — conversation_id not found
export async function getConversationThread(
  conversationId: string,
  beforeMessageId?: string
): Promise<ThreadData> {
  const qs = beforeMessageId ? `?before=${encodeURIComponent(beforeMessageId)}` : '';
  const res = await apiFetch<GetThreadApiResponse>(`/api/messages/${conversationId}/${qs}`);
  return res.data;
}

// ─── POST /api/messages/<conversation_id>/read/ ──────────────────────────────

// Mark all messages in a conversation as read, resetting the unread count to 0.
// Returns void — the server responds 204 No Content on success.
//
// Throws ApiError on:
//   403 — caller is not a participant in this conversation
//   404 — conversation_id not found
export async function markConversationRead(conversationId: string): Promise<void> {
  await apiFetch(`/api/messages/${conversationId}/read/`, { method: 'POST' });
}

// Messaging API — send direct messages and start/continue conversations
// All endpoints require a valid JWT (handled by apiFetch).
// Ref: POST /api/messages/send/ — multipart/form-data

import { apiFetch } from '@/lib/api/client';

// ─── Types ───────────────────────────────────────────────────────────────────

// A single attachment returned in a message
export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  size: number; // bytes
}

// A message as returned by the API after a successful send
export interface SentMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  body: string;
  attachments: MessageAttachment[];
  sent_at: string;
  status: 'sent';
}

// The data envelope returned on a successful 201
export interface SendMessageResponseData {
  conversation_id: string;
  message: SentMessage;
}

interface SendMessageApiResponse {
  status: 'success';
  message: string;
  data: SendMessageResponseData;
}

// ─── Payload ─────────────────────────────────────────────────────────────────

// Exactly one of conversation_id or recipient_id must be provided.
// At least one of body or attachments must be present.
export type SendMessagePayload =
  | {
      // Mode A — reply in an existing conversation
      conversation_id: string;
      recipient_id?: never;
      load_id?: never;
      capacity_id?: never;
      board_post_id?: never;
      body?: string;
      attachments?: File[];
    }
  | {
      // Mode B — start a new conversation with a company
      recipient_id: string;
      conversation_id?: never;
      // optional context links (at most one should be set)
      load_id?: string;
      capacity_id?: string;
      board_post_id?: string;
      body?: string;
      attachments?: File[];
    };

// ─── POST /api/messages/send/ ────────────────────────────────────────────────

// Send a direct message. Creates a new conversation when recipient_id is provided,
// or appends to an existing one when conversation_id is provided.
//
// Throws ApiError on:
//   400 — neither conversation_id nor recipient_id supplied
//   400 — body and attachments are both empty
//   400 — recipient not found / invalid
export async function sendMessage(payload: SendMessagePayload): Promise<SendMessageResponseData> {
  const form = new FormData();

  if (payload.conversation_id) {
    form.append('conversation_id', payload.conversation_id);
  } else if (payload.recipient_id) {
    form.append('recipient_id', payload.recipient_id);
    if (payload.load_id) form.append('load_id', payload.load_id);
    if (payload.capacity_id) form.append('capacity_id', payload.capacity_id);
    if (payload.board_post_id) form.append('board_post_id', payload.board_post_id);
  }

  if (payload.body) form.append('body', payload.body);
  if (payload.attachments?.length) {
    for (const file of payload.attachments) {
      form.append('attachments', file);
    }
  }

  const res = await apiFetch<SendMessageApiResponse>('/api/messages/send/', {
    method: 'POST',
    body: form,
  });

  return res.data;
}

// ─── GET /api/messages/ ──────────────────────────────────────────────────────

export interface ConversationCounterparty {
  id: string;
  company_name: string;
  role: 'shipper' | 'broker' | 'carrier';
  verification_status: string;
}

export interface ConversationSummary {
  id: string;
  counterparty: ConversationCounterparty;
  job_id: string | null;
  job_status: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export interface InboxData {
  total_unread: number;
  conversations: ConversationSummary[];
}

interface GetInboxApiResponse {
  status: 'success';
  message: string;
  data: InboxData;
}

// Fetch the authenticated user's inbox, ordered by most recent message.
// Pass q to filter by job ID or company name (server-side search).
//
// Throws ApiError on:
//   401 — missing or invalid token (handled by apiFetch refresh logic)
export async function getInbox(q?: string): Promise<InboxData> {
  const qs = q ? `?q=${encodeURIComponent(q)}` : '';
  const res = await apiFetch<GetInboxApiResponse>(`/api/messages/${qs}`);
  return res.data;
}

// ─── GET /api/messages/unread-count/ ─────────────────────────────────────────

interface UnreadCountApiResponse {
  status: 'success';
  message: string;
  data: { count: number };
}

// Lightweight poll for the navbar badge — returns total unread message count.
// Intended to be called on a short interval (e.g. every 30s) while the user is active.
//
// Throws ApiError on:
//   401 — missing or invalid token (handled by apiFetch refresh logic)
export async function getUnreadCount(): Promise<number> {
  const res = await apiFetch<UnreadCountApiResponse>('/api/messages/unread-count/');
  return res.data.count;
}

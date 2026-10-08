// Community group messaging API
// All endpoints require a valid JWT (handled by apiFetch).

import { apiFetch } from '@/lib/api/client';

// ─── Types ───────────────────────────────────────────────────────────────────

export type CommunityRole = 'shipper' | 'broker' | 'carrier';

// Attachment returned by both GET and POST — type 'image' renders inline
export interface CommunityAttachment {
  id: string;
  name: string;
  url: string;
  size: number; // bytes
  type: 'image' | 'file';
}

// A single community message from the API (snake_case wire format)
export interface CommunityMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: CommunityRole;
  body: string;
  attachments: CommunityAttachment[];
  sent_at: string;
  status: 'sent' | 'sending' | 'error';
}

// ─── GET /api/community/messages/ ────────────────────────────────────────────

export interface CommunityHistoryData {
  messages: CommunityMessage[];
  has_more: boolean;
  // Cursor — pass as beforeMessageId to load the next (older) page
  oldest_id: string | null;
}

interface GetCommunityHistoryApiResponse {
  status: 'success';
  message: string;
  data: CommunityHistoryData;
}

// Fetch the latest 30 community messages, ordered oldest-first within the page.
// Pass beforeMessageId (= oldest_id from the previous response) to load older messages.
// Pass limit (max 100) to override the default page size.
//
// Throws ApiError on:
//   401 — missing or invalid token
export async function getCommunityHistory(opts?: {
  beforeMessageId?: string;
  limit?: number;
}): Promise<CommunityHistoryData> {
  const qs = new URLSearchParams();
  if (opts?.beforeMessageId) qs.set('before', opts.beforeMessageId);
  if (opts?.limit) qs.set('limit', String(opts.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  const res = await apiFetch<GetCommunityHistoryApiResponse>(`/api/community/messages/${query}`);
  return res.data;
}

// ─── POST /api/community/messages/send/ ──────────────────────────────────────

// The confirmed message returned on 201
export interface SentCommunityMessage extends CommunityMessage {
  status: 'sent';
}

interface SendCommunityMessageApiResponse {
  status: 'success';
  message: string;
  data: SentCommunityMessage;
}

// Send a broadcast message to the community channel.
// At least one of body or attachments must be present.
//
// Throws ApiError on:
//   400 — body and attachments both empty
//   401 — missing or invalid token
export async function sendCommunityMessage(opts: {
  body?: string;
  attachments?: File[];
}): Promise<SentCommunityMessage> {
  const form = new FormData();
  if (opts.body) form.append('body', opts.body);
  if (opts.attachments?.length) {
    for (const file of opts.attachments) {
      form.append('attachments', file);
    }
  }
  const res = await apiFetch<SendCommunityMessageApiResponse>('/api/community/messages/send/', {
    method: 'POST',
    body: form,
  });
  return res.data;
}

// WebSocket API — real-time direct message channel
// ws://host/ws/messages/<conversation_id>/?token=<access_token>
//
// - Only participants can connect; the server closes the socket immediately
//   for unauthenticated or non-participant connections (no error frame).
// - Attachments in WS receive payloads are always [].
//   Use REST POST /api/messages/send/ for file uploads — the server broadcasts
//   the full payload (with attachments) through this same channel.

import { getAccessToken } from '@/lib/api/tokens';

// ─── Types ───────────────────────────────────────────────────────────────────

// Shape of a message pushed from the server to the client
export interface WsIncomingMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  body: string;
  attachments: []; // always empty over WS — files arrive via REST broadcast
  sent_at: string;
  status: 'sent';
}

// Shape of a message the client sends to the server
export interface WsOutgoingMessage {
  body: string;
}

export type WsStatus = 'connecting' | 'open' | 'closed' | 'error';

export interface DirectMessageSocketHandlers {
  // Called for every message pushed by the server (own + counterparty)
  onMessage: (msg: WsIncomingMessage) => void;
  // Called when the connection is established
  onOpen?: () => void;
  // Called when the socket closes — code 1000 = clean close, 4001 = auth/participant rejection
  onClose?: (code: number) => void;
  // Called on unexpected errors (network failure etc.)
  onError?: (event: Event) => void;
}

// ─── createDirectMessageSocket ───────────────────────────────────────────────

// Opens a WebSocket for a specific conversation and returns a handle with
// send() and close() methods.
//
// Usage:
//   const socket = createDirectMessageSocket(conversationId, {
//     onMessage: (msg) => setMessages(prev => [...prev, msg]),
//     onClose: (code) => { if (code !== 1000) console.warn('WS closed', code); },
//   });
//   // later:
//   socket.send('Hello!');
//   socket.close();
//
// Notes:
// - Call close() in the component's cleanup (useEffect return) to avoid leaks.
// - send() silently no-ops if the socket is not open.
// - The server closes the socket with no frame if the token is invalid or the
//   caller is not a participant — onClose fires with code 1006 in that case.
export function createDirectMessageSocket(
  conversationId: string,
  handlers: DirectMessageSocketHandlers
): { send: (body: string) => void; close: () => void; getStatus: () => WsStatus } {
  const token = getAccessToken();
  if (!token) {
    // No token — don't attempt to connect; call onClose immediately
    handlers.onClose?.(4001);
    return {
      send: () => undefined,
      close: () => undefined,
      getStatus: () => 'closed',
    };
  }

  const wsBase = (process.env.NEXT_PUBLIC_WS_BASE_URL ?? 'ws://127.0.0.1:8000')
    .replace(/^http/, 'ws'); // accept http(s) base URLs too

  const url = `${wsBase}/ws/messages/${conversationId}/?token=${encodeURIComponent(token)}`;
  const socket = new WebSocket(url);
  let status: WsStatus = 'connecting';

  socket.onopen = () => {
    status = 'open';
    handlers.onOpen?.();
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data as string) as WsIncomingMessage;
      handlers.onMessage(data);
    } catch {
      // Malformed frame — ignore silently
    }
  };

  socket.onclose = (event: CloseEvent) => {
    status = 'closed';
    handlers.onClose?.(event.code);
  };

  socket.onerror = (event: Event) => {
    status = 'error';
    handlers.onError?.(event);
  };

  return {
    // Send a plain-text message — no-ops if socket is not open
    send(body: string) {
      if (socket.readyState !== WebSocket.OPEN) return;
      const payload: WsOutgoingMessage = { body };
      socket.send(JSON.stringify(payload));
    },
    // Cleanly close the connection
    close() {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close(1000);
      }
    },
    getStatus: () => status,
  };
}

// ─── Community WebSocket ─────────────────────────────────────────────────────
// ws://host/ws/community/?token=<access_token>
//
// Single shared room for all authenticated active users.
// Server closes the socket immediately if the token is invalid or user is inactive.
// Attachments in receive payloads are always [] — use REST POST for file uploads.

import type { CommunityRole } from './groupMessagingAPI';

// Shape pushed from the server to all connected clients
export interface WsCommunityMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: CommunityRole;
  body: string;
  attachments: []; // always empty over WS
  sent_at: string;
  status: 'sent';
}

export interface CommunitySocketHandlers {
  onMessage: (msg: WsCommunityMessage) => void;
  onOpen?: () => void;
  // code 1000 = clean close, 1006 = auth/inactive rejection (server closed with no frame)
  onClose?: (code: number) => void;
  onError?: (event: Event) => void;
}

// Opens the community broadcast WebSocket and returns the same send/close/getStatus handle.
//
// Usage:
//   const socket = createCommunitySocket({
//     onMessage: (msg) => setMessages(prev => [...prev, msg]),
//   });
//   socket.send('Looking for backhaul from Dallas.');
//   // cleanup:
//   socket.close();
export function createCommunitySocket(
  handlers: CommunitySocketHandlers
): { send: (body: string) => void; close: () => void; getStatus: () => WsStatus } {
  const token = getAccessToken();
  if (!token) {
    handlers.onClose?.(4001);
    return {
      send: () => undefined,
      close: () => undefined,
      getStatus: () => 'closed',
    };
  }

  const wsBase = (process.env.NEXT_PUBLIC_WS_BASE_URL ?? 'ws://127.0.0.1:8000')
    .replace(/^http/, 'ws');

  const url = `${wsBase}/ws/community/?token=${encodeURIComponent(token)}`;
  const socket = new WebSocket(url);
  let status: WsStatus = 'connecting';

  socket.onopen = () => {
    status = 'open';
    handlers.onOpen?.();
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data as string) as WsCommunityMessage;
      handlers.onMessage(data);
    } catch {
      // Malformed frame — ignore
    }
  };

  socket.onclose = (event: CloseEvent) => {
    status = 'closed';
    handlers.onClose?.(event.code);
  };

  socket.onerror = (event: Event) => {
    status = 'error';
    handlers.onError?.(event);
  };

  return {
    send(body: string) {
      if (socket.readyState !== WebSocket.OPEN) return;
      socket.send(JSON.stringify({ body }));
    },
    close() {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close(1000);
      }
    },
    getStatus: () => status,
  };
}

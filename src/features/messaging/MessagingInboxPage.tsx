'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Conversation {
  id: string;
  jobId: string;
  counterparty: string;
  counterpartyRole: 'shipper' | 'broker' | 'carrier';
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  jobStatus: 'bidding' | 'booked' | 'completed' | 'open';
}

const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 'c1', jobId: 'FTL-2026-0042', counterparty: 'Acme Freight LLC', counterpartyRole: 'shipper', lastMessage: 'Hi, can you confirm the liftgate will be available at pickup?', lastMessageAt: '2026-09-19T14:30:00Z', unreadCount: 2, jobStatus: 'bidding' },
  { id: 'c2', jobId: 'FTL-2026-0035', counterparty: 'FastHaul LLC', counterpartyRole: 'carrier', lastMessage: 'We can do $2,200 if you need pickup by Thursday.', lastMessageAt: '2026-09-18T10:15:00Z', unreadCount: 1, jobStatus: 'booked' },
  { id: 'c3', jobId: 'FTL-2026-0031', counterparty: 'BridgeLogistics', counterpartyRole: 'broker', lastMessage: 'Delivery confirmed. Thanks for a smooth job.', lastMessageAt: '2026-09-15T08:00:00Z', unreadCount: 0, jobStatus: 'completed' },
  { id: 'c4', jobId: 'FTL-2026-0028', counterparty: 'Desert Logistics', counterpartyRole: 'shipper', lastMessage: 'Do you have availability on the 27th?', lastMessageAt: '2026-09-12T16:45:00Z', unreadCount: 0, jobStatus: 'open' },
];

const JOB_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  bidding:   { bg: '#fff7ed', text: '#d93506' },
  booked:    { bg: '#d1fae5', text: '#065f46' },
  completed: { bg: '#f0fdf4', text: '#15803d' },
  open:      { bg: '#e0f2fe', text: '#0369a1' },
};

const ROLE_LABELS: Record<string, string> = {
  shipper: 'Shipper', broker: 'Broker', carrier: 'Carrier',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function MessagingInboxPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_CONVERSATIONS.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.jobId.toLowerCase().includes(q) || c.counterparty.toLowerCase().includes(q);
  });

  const totalUnread = MOCK_CONVERSATIONS.reduce((s, c) => s + c.unreadCount, 0);

  return (
    <div className="mx-auto max-w-[760px] px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
            <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />
            MESSAGES
          </span>
          <h1 className="mt-1 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Inbox
            {totalUnread > 0 && (
              <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: '#fc3f07' }} aria-label={`${totalUnread} unread`}>
                {totalUnread > 9 ? '9+' : totalUnread}
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">All conversations are linked to a specific job.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by job ID or company…"
          className="w-full rounded-xl border border-[#e0d5c8] bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20" />
      </div>

      {/* Conversation list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d5c8] bg-white py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl" style={{ background: '#f3ede4' }} aria-hidden="true">💬</div>
          <p className="text-base font-medium text-neutral-700">{search ? 'No conversations match your search.' : 'No conversations yet.'}</p>
          <p className="mt-1 text-sm text-neutral-400">Conversations are created when you message a counterparty on a job.</p>
        </div>
      ) : (
        <div className="space-y-2" role="list" aria-label="Conversations">
          {filtered.map((c) => {
            const statusStyle = JOB_STATUS_STYLES[c.jobStatus];
            return (
              <Link
                key={c.id}
                href={`/messages/${c.id}`}
                role="listitem"
                className="flex items-start gap-4 rounded-2xl border bg-white p-4 transition-all hover:border-[#fc3f07] hover:shadow-sm"
                style={{ borderColor: c.unreadCount > 0 ? '#fc3f07' : '#e8e0d6' }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: '#2b1508' }} aria-hidden="true">
                    {c.counterparty.slice(0, 2).toUpperCase()}
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: '#fc3f07' }} aria-hidden="true">
                      {c.unreadCount}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={`text-sm ${c.unreadCount > 0 ? 'font-bold text-neutral-900' : 'font-semibold text-neutral-700'}`}>{c.counterparty}</p>
                        <span className="text-[10px] text-neutral-400">{ROLE_LABELS[c.counterpartyRole]}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-400">{c.jobId}</span>
                        <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[1px]" style={{ background: statusStyle.bg, color: statusStyle.text }}>
                          {c.jobStatus}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px] text-neutral-400">{timeAgo(c.lastMessageAt)}</span>
                  </div>
                  <p className={`mt-1.5 truncate text-xs leading-relaxed ${c.unreadCount > 0 ? 'font-medium text-neutral-700' : 'text-neutral-400'}`}>
                    {c.lastMessage}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

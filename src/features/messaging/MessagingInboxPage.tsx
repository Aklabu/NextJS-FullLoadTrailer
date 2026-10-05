'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type Tab = 'direct' | 'community';

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
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function DirectTab({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const filtered = MOCK_CONVERSATIONS.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.jobId.toLowerCase().includes(q) || c.counterparty.toLowerCase().includes(q);
  });

  return (
    <>
      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by job ID or company…"
          className="w-full rounded-xl border border-[#e0d5c8] bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d5c8] bg-white py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl" style={{ background: '#f3ede4' }} aria-hidden="true">💬</div>
          <p className="text-base font-medium text-neutral-700">{search ? 'No conversations match your search.' : 'No conversations yet.'}</p>
          <p className="mt-1 text-sm text-neutral-400">Conversations are created when you message a counterparty on a job.</p>
        </div>
      ) : (
        <div className="space-y-2" role="list" aria-label="Direct conversations">
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
                <div className="relative shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: '#2b1508' }} aria-hidden="true">
                    {c.counterparty.slice(0, 2).toUpperCase()}
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: '#fc3f07' }} aria-hidden="true">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
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
    </>
  );
}

function CommunityTab() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d5c8] bg-white py-16 text-center px-6">
      <span className="mb-4 text-4xl" aria-hidden="true">💬</span>
      <h2 className="text-base font-semibold text-neutral-800">Community Chat</h2>
      <p className="mt-1 max-w-xs text-sm text-neutral-500">
        One industry-wide chat for shippers, brokers, and carriers. Share loads, ask questions, and stay connected.
      </p>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Included in Tier 1 · Free
      </div>
      <a
        href="/community"
        className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: '#fc3f07' }}
      >
        Open Community Chat →
      </a>
    </div>
  );
}

export default function MessagingInboxPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get('tab') === 'community' ? 'community' : 'direct') as Tab;
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [search, setSearch] = useState('');

  // Sync tab to URL query param without full navigation
  useEffect(() => {
    const url = activeTab === 'community' ? '/messages?tab=community' : '/messages';
    router.replace(url, { scroll: false });
  }, [activeTab, router]);

  const directUnread = MOCK_CONVERSATIONS.reduce((s, c) => s + c.unreadCount, 0);
  const communityUnread = 0;
  const totalUnread = directUnread + communityUnread;

  function TabButton({ tab, label, unread }: { tab: Tab; label: string; unread: number }) {
    const isActive = activeTab === tab;
    return (
      <button
        type="button"
        onClick={() => setActiveTab(tab)}
        className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
          isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
        }`}
        aria-current={isActive ? 'true' : undefined}
      >
        {label}
        {unread > 0 && (
          <span
            className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
            style={{ background: '#fc3f07' }}
            aria-label={`${unread} unread`}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
        {isActive && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: '#fc3f07' }} />
        )}
      </button>
    );
  }

  return (
    <div className="mx-auto max-w-[760px] px-6 py-8">
      {/* Header */}
      <div className="mb-5">
        <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
          <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />
          MESSAGES
        </span>
        <h1 className="mt-1 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Messages
          {totalUnread > 0 && (
            <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: '#fc3f07' }} aria-label={`${totalUnread} unread`}>
              {totalUnread > 9 ? '9+' : totalUnread}
            </span>
          )}
        </h1>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-[#e8e0d6]" role="tablist" aria-label="Message types">
        <TabButton tab="community" label="Community Channels" unread={communityUnread} />
        <TabButton tab="direct" label="Direct Messages" unread={directUnread} />
      </div>

      {/* Tab content */}
      {activeTab === 'direct' ? (
        <DirectTab search={search} setSearch={setSearch} />
      ) : (
        <CommunityTab />
      )}
    </div>
  );
}

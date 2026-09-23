'use client';

import { useState } from 'react';

type Audience = 'shipper' | 'carrier';

export default function PricingHero() {
  const [active, setActive] = useState<Audience>('shipper');

  return (
    <header
      style={{
        textAlign: 'center',
        padding: '64px 24px 48px',
        background: 'linear-gradient(to bottom, #fff7ed, #fdf6ee)',
      }}
    >
      {/* Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#fff',
          border: '1px solid #fed7aa',
          borderRadius: 999,
          padding: '6px 16px',
          fontSize: 12,
          fontWeight: 600,
          color: '#d93506',
          marginBottom: 24,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d93506', display: 'inline-block' }} />
        TRANSPARENT PRICING &amp; ARCHITECTURE TIERS
        <span style={{ color: '#d1d5db' }}>|</span>
        <span style={{ color: '#6b7280', fontWeight: 400 }}>ZERO HIDDEN BROKER SKIM</span>
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 400,
          lineHeight: 1.2,
          color: '#1a1a1a',
          marginBottom: 24,
        }}
      >
        Simple, Scalable Freight Tiers.
        <br />
        <span
          style={{
            fontStyle: 'italic',
            color: '#fc3f07',
            textDecoration: 'underline',
            textDecorationColor: '#f3a76a',
            textUnderlineOffset: 8,
          }}
        >
          Start Free, Upgrade Anytime.
        </span>
      </h1>

      <p
        style={{
          maxWidth: 560,
          margin: '0 auto 32px',
          color: '#6b7280',
          fontSize: 16,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1.6,
        }}
      >
        Instant spot bulletin or legally binding digital execution with escrow protection. Choose what fits your volume.
      </p>

      {/* Audience toggle */}
      <div
        style={{
          display: 'inline-flex',
          gap: 8,
          background: '#fff',
          border: '1px solid #fed7aa',
          borderRadius: 999,
          padding: 6,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
        role="group"
        aria-label="Select audience"
      >
        <button
          type="button"
          onClick={() => setActive('shipper')}
          aria-pressed={active === 'shipper'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: active === 'shipper' ? '#fc3f07' : 'transparent',
            color: active === 'shipper' ? '#fff' : '#4b5563',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 999,
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          🏠 For Shippers &amp; Brokers
        </button>
        <button
          type="button"
          onClick={() => setActive('carrier')}
          aria-pressed={active === 'carrier'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: active === 'carrier' ? '#fc3f07' : 'transparent',
            color: active === 'carrier' ? '#fff' : '#4b5563',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 999,
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          🚚 For Carriers &amp; Fleets
        </button>
      </div>

      <p
        style={{
          fontSize: 12,
          color: '#9ca3af',
          marginTop: 16,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        ⓘ Monthly, Annual &amp; Custom Fleet configurations available • Standard and Enterprise invoicing options
      </p>
    </header>
  );
}

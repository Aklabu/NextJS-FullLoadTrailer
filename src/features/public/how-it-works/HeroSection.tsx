'use client';

import { useState } from 'react';

type Role = 'shipper' | 'carrier';

export default function HeroSection() {
  const [activeRole, setActiveRole] = useState<Role>('shipper');

  return (
    <header
      className="text-center px-6"
      style={{
        padding: '90px 24px 60px',
        background:
          'radial-gradient(circle at 30% 20%, #fbe3c4, transparent 60%), radial-gradient(circle at 70% 30%, #f6d9d3, transparent 60%), #fdf6ee',
      }}
    >
      {/* Headline */}
      <h1
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 52,
          fontWeight: 400,
          lineHeight: 1.15,
          color: '#2b2420',
        }}
      >
        How FullTrailerLoad Powers
        <br />
        <span
          style={{
            color: '#fc3f07',
            textDecoration: 'underline',
            textDecorationColor: '#f3a76a',
            textUnderlineOffset: 8,
          }}
        >
          Household Goods Moving
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="mx-auto"
        style={{
          maxWidth: 620,
          margin: '24px auto 36px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#7a7168',
          fontSize: 16,
        }}
      >
        Whether you are coordinating household goods moves or listing available truck capacity, discover our graduated platform — from community bulletin board to legally binding move confirmation.
      </p>

      {/* Role pills */}
      <div
        className="inline-flex gap-3"
        style={{
          background: '#fff',
          border: '1px solid #ece1d3',
          borderRadius: 999,
          padding: 6,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
        }}
        role="group"
        aria-label="Select your role"
      >
        <button
          type="button"
          onClick={() => setActiveRole('shipper')}
          aria-pressed={activeRole === 'shipper'}
          className="flex items-center gap-2"
          style={{
            padding: '10px 20px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            background: activeRole === 'shipper' ? '#fc3f07' : 'transparent',
            color: activeRole === 'shipper' ? '#fff' : '#7a7168',
          }}
        >
          🏠 Moving Companies &amp; Brokers
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 999,
              background: activeRole === 'shipper' ? 'rgba(255,255,255,0.25)' : '#fbeee0',
              color: activeRole === 'shipper' ? '#fff' : '#7a7168',
            }}
          >
            DEMAND
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveRole('carrier')}
          aria-pressed={activeRole === 'carrier'}
          className="flex items-center gap-2"
          style={{
            padding: '10px 20px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            background: activeRole === 'carrier' ? '#fc3f07' : 'transparent',
            color: activeRole === 'carrier' ? '#fff' : '#7a7168',
          }}
        >
          🚚 HHG Carriers &amp; Owner-Operators
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 999,
              background: activeRole === 'carrier' ? 'rgba(255,255,255,0.25)' : '#fbeee0',
              color: activeRole === 'carrier' ? '#fff' : '#7a7168',
            }}
          >
            SUPPLY
          </span>
        </button>
      </div>
    </header>
  );
}

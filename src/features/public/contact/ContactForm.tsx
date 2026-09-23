'use client';

import { useState } from 'react';

type Urgency = 'normal' | 'urgent';
type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [urgency, setUrgency] = useState<Urgency>('normal');
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    category: 'Account & SAFER / COI Verification',
    message: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    // TODO: POST /support/contact/
    await new Promise((r) => setTimeout(r, 900));
    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div
        style={{
          background: '#f7ece0',
          borderRadius: 24,
          padding: '48px 32px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 400, color: '#1a1a1a', marginBottom: 8 }}>
          Message Received
        </h3>
        <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 360, margin: '0 auto' }}>
          Our freight operations team will respond within 2 business hours. Check your email for a ticket confirmation.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#f7ece0',
        borderRadius: 24,
        padding: '32px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: '#d93506', letterSpacing: 1.5, marginBottom: 4, textTransform: 'uppercase' }}>
        INQUIRY DISPATCH
      </div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 400, color: '#1a1a1a', marginBottom: 4 }}>
        Send a Support Request
      </h2>
      <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 24 }}>
        Target API:{' '}
        <code style={{ background: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>
          POST /support/contact/
        </code>
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Name + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="contact-form-2col">
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#1a1a1a' }}>
              Full Name <span style={{ color: '#fc3f07' }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Marcus Vance"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#1a1a1a' }}>
              Work Email <span style={{ color: '#fc3f07' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@company.com"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Company + Urgency */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="contact-form-2col">
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#1a1a1a' }}>
              Company Name &amp; Role{' '}
              <span style={{ color: '#9ca3af', fontWeight: 400 }}>(Optional)</span>
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Apex Logistics Inc (Carrier)"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#1a1a1a' }}>
              Urgency Level
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setUrgency('normal')}
                style={{
                  flex: 1, fontSize: 13, fontWeight: 600,
                  border: urgency === 'normal' ? '2px solid #fc3f07' : '1px solid #e5e7eb',
                  color: urgency === 'normal' ? '#d93506' : '#6b7280',
                  background: urgency === 'normal' ? '#fff7ed' : '#fff',
                  borderRadius: 8, padding: '10px 8px',
                  cursor: 'pointer',
                }}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setUrgency('urgent')}
                style={{
                  flex: 1, fontSize: 13, fontWeight: 600,
                  border: urgency === 'urgent' ? '2px solid #fc3f07' : '1px solid #e5e7eb',
                  color: urgency === 'urgent' ? '#d93506' : '#6b7280',
                  background: urgency === 'urgent' ? '#fff7ed' : '#fff',
                  borderRadius: 8, padding: '10px 8px',
                  cursor: 'pointer',
                }}
              >
                Urgent Spot Issue
              </button>
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#1a1a1a' }}>
            Inquiry Category <span style={{ color: '#fc3f07' }}>*</span>
          </label>
          <select name="category" value={form.category} onChange={handleChange} required style={inputStyle}>
            <option>Account &amp; SAFER / COI Verification</option>
            <option>Rate Confirmation Dispute</option>
            <option>Billing &amp; Escrow</option>
            <option>Technical Issue</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
              Message Description <span style={{ color: '#fc3f07' }}>*</span>
            </label>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>Max 1,500 chars</span>
          </div>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={4}
            maxLength={1500}
            placeholder="Describe your inquiry in detail..."
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        {/* File upload */}
        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#1a1a1a' }}>
            Supporting Documentation{' '}
            <span style={{ color: '#9ca3af', fontWeight: 400 }}>(Rate Con, BOL, COI or PDF)</span>
          </label>
          <div
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.6)',
              padding: '32px 24px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              Click to attach files or drag &amp; drop here
            </p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>PDF, PNG, JPG up to 25MB per document</p>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: status === 'submitting' ? '#e5a87a' : '#fc3f07',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            borderRadius: 999,
            padding: '14px 24px',
            border: 'none',
            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            alignSelf: 'flex-start',
            transition: 'background 0.2s',
          }}
        >
          {status === 'submitting' ? 'Sending…' : 'Send Support Message →'}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  padding: '10px 16px',
  fontSize: 14,
  background: '#fff',
  color: '#1a1a1a',
  outline: 'none',
  boxSizing: 'border-box',
};

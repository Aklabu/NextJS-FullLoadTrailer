'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBooking, completeBooking, type BookingDetail } from '@/features/marketplace/api/bookingApi';
import { ApiError } from '@/lib/api/client';

interface Props {
  id: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTs(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-5 mx-auto max-w-[640px] px-6 py-10">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-neutral-100" />
        <div className="h-6 w-48 rounded bg-neutral-100" />
        <div className="h-8 w-64 rounded bg-neutral-100" />
      </div>
      <div className="h-24 rounded-2xl bg-neutral-100" />
      <div className="h-20 rounded-2xl bg-neutral-100" />
      <div className="h-40 rounded-2xl bg-neutral-100" />
    </div>
  );
}

export default function BookingConfirmationPage({ id }: Props) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);
  const [completionError, setCompletionError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getBooking(id);
        setBooking(res.data);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401) { router.push('/auth/login'); return; }
          if (err.status === 403) { setError('You are not a party to this booking.'); }
          else if (err.status === 404) { setError('Booking not found.'); }
          else { setError(err.message || 'Failed to load booking.'); }
        } else {
          setError('Unable to connect. Check your internet and try again.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  async function handleComplete() {
    if (!booking) return;
    setCompleting(true);
    setCompletionError('');
    try {
      const res = await completeBooking(id);
      // Update booking state with completion status from backend response
      setBooking({
        ...booking,
        completed_by_shipper: res.data.completed_by_shipper,
        completed_by_carrier: res.data.completed_by_carrier,
        status: res.data.both_completed ? 'completed' : booking.status,
        completed_at: res.data.completed_at,
      });
    } catch (err) {
      const apiErr = err as ApiError;
      // If already marked complete (400), just refresh the booking data
      if (apiErr?.status === 400) {
        try {
          const refreshed = await getBooking(id);
          setBooking(refreshed.data);
        } catch {
          setCompletionError('You have already marked this booking as completed.');
        }
      } else {
        setCompletionError(apiErr?.message ?? 'Failed to mark as completed. Please try again.');
      }
    } finally {
      setCompleting(false);
    }
  }

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="mx-auto max-w-[640px] px-6 py-10">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const b = booking;

  return (
    <div className="mx-auto max-w-[640px] px-6 py-10">

      {/* Success banner */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
          BOOKING CONFIRMED
        </span>
        <h1 className="mt-1 text-[clamp(24px,4vw,32px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Load booked successfully
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Terms are locked in and both parties have been notified. Confirmed at {formatTs(b.confirmed_at)}.
        </p>
      </div>

      {/* Job ID card */}
      <div className="mb-5 rounded-2xl border-2 border-[#fc3f07] bg-white p-5 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[1.5px] text-neutral-400">Master Job ID</p>
        <p className="mt-1 font-mono text-3xl font-bold text-neutral-900">{b.job_id}</p>
        <p className="mt-0.5 text-xs text-neutral-400">Booking ref: {b.booking_ref}</p>
      </div>

      {/* Agreed price */}
      <div className="mb-5 rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[1px] text-neutral-400">Agreed rate</p>
            <p className="mt-1 text-3xl font-bold text-neutral-900">${Number(b.agreed_price).toLocaleString()}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: '#d1fae5' }} aria-hidden="true">
            🤝
          </div>
        </div>
      </div>

      {/* Route + dates */}
      <div className="mb-5 rounded-2xl border border-[#e8e0d6] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-neutral-800" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Load details</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f3ede4] text-xs font-bold text-[#fc3f07]" aria-hidden="true">A</div>
            <div>
              <p className="text-[10px] text-neutral-400">PICKUP · {formatDate(b.load.pickup_date)}</p>
              <p className="text-sm font-semibold text-neutral-800">{b.load.origin}</p>
            </div>
          </div>
          <div className="ml-3.5 h-5 w-px bg-[#e8e0d6]" aria-hidden="true" />
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d1fae5] text-xs font-bold text-emerald-700" aria-hidden="true">B</div>
            <div>
              <p className="text-[10px] text-neutral-400">DELIVERY · {formatDate(b.load.delivery_date)}</p>
              <p className="text-sm font-semibold text-neutral-800">{b.load.destination}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 border-t border-[#f0ece6] pt-3">
            <div>
              <p className="text-[10px] text-neutral-400">CUBIC FEET</p>
              <p className="text-sm font-medium text-neutral-800">{b.load.cubic_feet.toLocaleString()} cu ft</p>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400">EQUIPMENT</p>
              <p className="text-sm font-medium text-neutral-800">{b.load.equipment_type}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Both parties — contact info revealed post-booking */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { role: 'Shipper', party: b.shipper, icon: '📦' },
          { role: 'Carrier', party: b.carrier, icon: '🚚' },
        ].map(({ role, party, icon }) => (
          <div key={role} className="rounded-2xl border border-[#e8e0d6] bg-white p-4 shadow-sm">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[1px] text-neutral-400">
              <span aria-hidden="true">{icon}</span> {role}
            </p>
            <p className="text-sm font-semibold text-neutral-800">{party.company_name}</p>
            <p className="text-xs text-neutral-500">{party.email}</p>
            <p className="text-xs text-neutral-500">{party.phone}</p>
          </div>
        ))}
      </div>

      {/* Next steps */}
      <div className="mb-6 rounded-2xl border border-[#f0c896] bg-[#fffbf5] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[1px] text-[#d93506]">What happens next</p>
        <ul className="space-y-2.5">
          {[
            'Both parties have been notified by email with this confirmation.',
            'Use in-platform messaging for any pre-pickup coordination.',
            'The carrier will confirm pickup on the scheduled date.',
            'After delivery, both parties can leave a review.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-[#7a4a1a]">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fc3f07] text-[9px] font-bold text-white" aria-hidden="true">{i + 1}</span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Completion status */}
      {b.status === 'completed' ? (
        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-800">Job completed</p>
              <p className="mt-0.5 text-xs text-emerald-700">
                Both parties have confirmed delivery completion. You can now leave a review.
              </p>
            </div>
          </div>
        </div>
      ) : (b.completed_by_shipper || b.completed_by_carrier) ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Waiting for confirmation</p>
              <p className="mt-0.5 text-xs text-amber-700">
                {b.completed_by_shipper 
                  ? 'You have confirmed completion. Waiting for carrier to confirm.'
                  : 'Carrier has confirmed completion. Please confirm delivery below.'}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {completionError && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{completionError}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Mark as Completed button - show if job not fully completed and user hasn't marked it yet */}
        {b.status !== 'completed' && (
          <button
            type="button"
            onClick={handleComplete}
            disabled={completing}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {completing ? (
              <>
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Marking complete…
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark as Completed
              </>
            )}
          </button>
        )}

        {/* Leave Review button - only show if job is completed */}
        {b.status === 'completed' && (
          <Link
            href={`/jobs/${encodeURIComponent(b.job_id)}/review`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
            style={{ background: '#fc3f07' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Leave a Review
          </Link>
        )}

        <Link href={`/messages/new?recipient_id=${b.carrier.id}&recipient_name=${encodeURIComponent(b.carrier.company_name)}&recipient_role=carrier&job_id=${encodeURIComponent(b.job_id)}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#e0d5c8] py-3 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          Message
        </Link>
        <button type="button" onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl border border-[#e0d5c8] px-5 py-3 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print
        </button>
        <Link href="/marketplace/my-loads"
          className="flex items-center gap-2 rounded-xl border border-[#e0d5c8] px-5 py-3 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
          Back to my loads
        </Link>
      </div>

    </div>
  );
}

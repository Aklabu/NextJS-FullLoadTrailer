'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingModal } from '@/features/auth/onboarding';
import { getMe } from '@/features/auth/api/authApi';
import { ApiError } from '@/lib/api/client';
import type { UserRole } from '@/lib/types/auth';

interface SessionUser {
  role: UserRole;
  companyName: string;
  hasSeenOnboarding: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  // Separate flag so dismissing the modal suppresses it for this session
  // without needing to refetch /me/ (the API already persisted the flag)
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getMe();
        const d = res.data;
        const sessionUser: SessionUser = {
          role: d.role,
          companyName: d.name,
          hasSeenOnboarding: d.has_seen_onboarding,
        };
        setUser(sessionUser);
        // Show modal only on first session after verification — never show again
        // once has_seen_onboarding is true (persisted server-side)
        if (!d.has_seen_onboarding) {
          setShowOnboarding(true);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.push('/auth/login');
        }
        // Other errors — dashboard still renders, modal just won't show
      }
    }
    load();
  }, [router]);

  function handleOnboardingFinish() {
    // Suppress modal for the rest of this session — markOnboardingSeen()
    // was already called inside OnboardingModal.dismiss() before onFinish fires
    setShowOnboarding(false);
  }

  return (
    <div className="px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">
        {user ? `Dashboard — ${user.companyName}` : 'Dashboard'}
      </h1>
      <p className="mt-2 text-sm text-neutral-500">Your dashboard content goes here.</p>

      {user && showOnboarding && (
        <OnboardingModal
          role={user.role}
          onFinish={handleOnboardingFinish}
        />
      )}
    </div>
  );
}

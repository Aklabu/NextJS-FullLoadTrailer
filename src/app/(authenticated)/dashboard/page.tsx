'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingModal } from '@/features/auth/onboarding';
import { DashboardContent } from '@/features/dashboard';
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
        if (!d.has_seen_onboarding) {
          setShowOnboarding(true);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.push('/auth/login');
        }
      }
    }
    load();
  }, [router]);

  function handleOnboardingFinish() {
    setShowOnboarding(false);
  }

  return (
    <>
      <DashboardContent />
      {user && showOnboarding && (
        <OnboardingModal
          role={user.role}
          onFinish={handleOnboardingFinish}
        />
      )}
    </>
  );
}

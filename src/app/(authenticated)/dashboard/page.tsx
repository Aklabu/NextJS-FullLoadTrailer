'use client';

import { useState } from 'react';
import { OnboardingModal } from '@/features/auth/onboarding';
import type { UserRole } from '@/lib/types/auth';

// TODO: replace with real auth context / server-side user data
const MOCK_USER = {
  role: 'shipper' as UserRole,
  companyName: 'Acme Freight',
  hasSeenOnboarding: false,
};

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(!MOCK_USER.hasSeenOnboarding);

  return (
    <div className="px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Dashboard — {MOCK_USER.companyName}
      </h1>
      <p className="mt-2 text-sm text-neutral-500">Your dashboard content goes here.</p>

      {showOnboarding && (
        <OnboardingModal
          role={MOCK_USER.role}
          onFinish={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import AuthModal from '@/components/auth/AuthModal';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setCurrentUser(data.user);
        } else {
          setAuthModalOpen(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-sm font-bold text-gray-500">
        Loading Bucolish Onboarding...
      </div>
    );
  }

  return (
    <>
      <OnboardingFlow
        initialUser={currentUser}
        onComplete={() => router.push('/quiz')}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => router.push('/')}
        onSuccess={(user) => {
          setCurrentUser(user);
          setAuthModalOpen(false);
        }}
      />
    </>
  );
}

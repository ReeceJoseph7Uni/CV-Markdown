'use client';

import { useState, useCallback, useEffect } from 'react';
import { UserProfile } from '@/types/comparison';

const STORAGE_KEY = 'everyrandsa_user_profile';

const PROFILE_LABELS: Record<UserProfile, string> = {
  [UserProfile.EMERGENCY_SAVINGS]: 'Emergency Savings',
  [UserProfile.TFSA]: 'Tax-Free Savings (TFSA)',
  [UserProfile.LARGE_BALANCE]: 'Large Balance',
  [UserProfile.NO_FEE]: 'No Monthly Fee',
  [UserProfile.SHORT_TERM]: 'Short-Term Savings',
};

function readProfileFromStorage(): UserProfile {
  if (typeof window === 'undefined') return UserProfile.EMERGENCY_SAVINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && Object.values(UserProfile).includes(stored as UserProfile)) {
      return stored as UserProfile;
    }
  } catch {
    // localStorage may be unavailable
  }
  return UserProfile.EMERGENCY_SAVINGS;
}

export function useUserProfile() {
  const [profile, setProfileState] = useState<UserProfile>(() => readProfileFromStorage());

  // Persist to localStorage on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, profile);
    } catch {
      // localStorage may be unavailable
    }
  }, [profile]);

  const setProfile = useCallback((newProfile: UserProfile) => {
    setProfileState(newProfile);
  }, []);

  const profileLabel = PROFILE_LABELS[profile];

  return {
    profile,
    setProfile,
    profileLabel,
  };
}

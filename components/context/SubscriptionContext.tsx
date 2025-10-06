'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface SubscriptionLimits {
  projects: number;
  teamMembers: number;
  storageGB: number;
  price: number;
  stripePriceId: string | null;
}

interface SubscriptionUsage {
  projects: number;
  teamMembers: number;
  storageGB: number;
}

interface SubscriptionData {
  plan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID';
  limits: SubscriptionLimits;
  usage: SubscriptionUsage;
  subscription: {
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
}

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  loading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  canCreateProject: boolean;
  canAddTeamMember: (projectId: string) => Promise<boolean>;
  canUploadFile: (fileSizeBytes: number) => Promise<boolean>;
  upgradePrompt: {
    show: boolean;
    type: 'projects' | 'team-members' | 'file-upload' | null;
    currentCount?: number;
    limit?: number;
    plan?: string;
  };
  showUpgradePrompt: (type: 'projects' | 'team-members' | 'file-upload', details?: any) => void;
  hideUpgradePrompt: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgradePrompt, setUpgradePrompt] = useState({
    show: false,
    type: null as 'projects' | 'team-members' | 'file-upload' | null,
    currentCount: undefined,
    limit: undefined,
    plan: undefined,
  });

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock subscription data instead of API call
      const mockSubscriptionData: SubscriptionData = {
        plan: 'PRO',
        status: 'ACTIVE',
        limits: {
          projects: 100,
          teamMembers: 50,
          storageGB: 100,
          price: 0,
          stripePriceId: null
        },
        usage: {
          projects: 0,
          teamMembers: 0,
          storageGB: 0
        },
        subscription: {
          currentPeriodStart: new Date(Date.now() - 86400000).toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
          cancelAtPeriodEnd: false
        }
      };
      
      setSubscription(mockSubscriptionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  const canCreateProject = true; // Always allow project creation in development mode

  const canAddTeamMember = async (projectId: string): Promise<boolean> => {
    return true; // Always allow adding team members in development mode
  };

  const canUploadFile = async (fileSizeBytes: number): Promise<boolean> => {
    return true; // Always allow file uploads in development mode
  };

  const showUpgradePrompt = (type: 'projects' | 'team-members' | 'file-upload', details?: any) => {
    setUpgradePrompt({
      show: true,
      type,
      currentCount: details?.currentCount,
      limit: details?.limit,
      plan: details?.plan,
    });
  };

  const hideUpgradePrompt = () => {
    setUpgradePrompt({
      show: false,
      type: null,
      currentCount: undefined,
      limit: undefined,
      plan: undefined,
    });
  };

  useEffect(() => {
    fetchSubscription();
  }, [session?.user?.id]);

  const value: SubscriptionContextType = {
    subscription,
    loading,
    error,
    refreshSubscription,
    canCreateProject,
    canAddTeamMember,
    canUploadFile,
    upgradePrompt,
    showUpgradePrompt,
    hideUpgradePrompt,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

"use client"

import { useEffect } from 'react';
import { pushLocalDataToCloud, pullCloudDataToLocal } from '@/lib/sync';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

export function useSync() {
  const setUserId = useAppStore((s) => s.setUserId);

  useEffect(() => {
    // 1. Initial auth state fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        pullCloudDataToLocal();
      }
    });

    // 2. Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUserId(session.user.id);
        pullCloudDataToLocal();
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
      }
    });

    // 3. Online Reconnection listener
    const handleOnline = () => {
      console.log("🌐 Network reconnected, initializing synchronization...");
      pushLocalDataToCloud();
    };
    window.addEventListener('online', handleOnline);

    // 4. Zustand state change subscription for Auto-Push (Write-Local Sync-Remote)
    const unsubscribe = useAppStore.subscribe(
      (state, prevState) => {
        // Prevent push if:
        // - No user is logged in
        // - Currently syncing (pulling data to prevent loops)
        if (!state.userId || state.syncing) return;

        // Check if relevant mutations happened
        const habitsChanged = JSON.stringify(state.habits) !== JSON.stringify(prevState.habits);
        const sleepChanged = JSON.stringify(state.sleepHistory) !== JSON.stringify(prevState.sleepHistory);
        const settingsChanged = state.userName !== prevState.userName || 
                                state.wakeGoal !== prevState.wakeGoal || 
                                state.sleepGoal !== prevState.sleepGoal;

        if (habitsChanged || sleepChanged || settingsChanged) {
          // Trigger asynchronous background push
          pushLocalDataToCloud();
        }
      }
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      subscription.unsubscribe();
      unsubscribe();
    };
  }, [setUserId]);
}

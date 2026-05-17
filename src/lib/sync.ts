import { supabase } from './supabase';
import { useAppStore } from '@/store/useAppStore';

export async function pushLocalDataToCloud() {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user?.id;
  
  if (!userId) return; // Not signed in
  
  const state = useAppStore.getState();
  state.setSyncing(true);

  try {
    // 1. Sync profile settings & XP
    await supabase.from('profiles').upsert({
      id: userId,
      user_name: state.userName,
      wake_goal: state.wakeGoal,
      sleep_goal: state.sleepGoal,
      xp: state.xp,
      updated_at: new Date().toISOString()
    });

    // 2. Sync today's morning routine
    if (state.habits && state.habits.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const tasksMap = state.habits.reduce((acc, h) => {
        acc[h.id] = h.completed;
        return acc;
      }, {} as Record<string, boolean>);

      await supabase.from('routines').upsert({
        user_id: userId,
        date: today,
        tasks: tasksMap
      });
    }

    // 3. Sync recent sleep history entry
    if (state.sleepHistory && state.sleepHistory.length > 0) {
      const lastSleep = state.sleepHistory[state.sleepHistory.length - 1];
      await supabase.from('sleep').upsert({
        user_id: userId,
        date: lastSleep.date,
        bedtime: lastSleep.bedtime + ':00',
        wake_time: lastSleep.wakeTime + ':00',
        duration_hours: Number(lastSleep.duration),
        score: lastSleep.score
      });
    }

    // 4. Sync streak information
    await supabase.from('streaks').upsert({
      user_id: userId,
      current_streak: state.currentStreak,
      last_active: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    });

    console.log("🔄 Local changes pushed to Supabase Cloud.");
  } catch (err) {
    console.warn("⚠️ Network synchronization paused:", err);
  } finally {
    state.setSyncing(false);
  }
}

export async function pullCloudDataToLocal() {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user?.id;
  
  if (!userId) return;

  const state = useAppStore.getState();
  state.setSyncing(true);

  try {
    // Pull Profile Settings
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    // Pull Streak
    const { data: streak } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // Pull Sleep History
    const { data: sleep } = await supabase
      .from('sleep')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (profile || streak || sleep) {
      // Overwrite local state with fetched cloud database
      useAppStore.setState({
        userName: profile?.user_name || state.userName,
        wakeGoal: profile?.wake_goal?.slice(0, 5) || state.wakeGoal,
        sleepGoal: profile?.sleep_goal?.slice(0, 5) || state.sleepGoal,
        xp: profile?.xp || state.xp,
        currentStreak: streak?.current_streak || state.currentStreak,
        sleepHistory: sleep ? sleep.map((s: any) => ({
          date: s.date,
          bedtime: s.bedtime?.slice(0, 5),
          wakeTime: s.wake_time?.slice(0, 5),
          duration: Number(s.duration_hours),
          score: s.score
        })) : state.sleepHistory
      });
      console.log("📥 Sync-Pull completed successfully.");
    }
  } catch (err) {
    console.warn("⚠️ Pull syncing paused:", err);
  } finally {
    state.setSyncing(false);
  }
}

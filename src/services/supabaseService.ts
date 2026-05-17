import { createClient } from '@supabase/supabase-js';

// Project details provided by earlier V2/V3 configuration
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://pigkaskoezqggknlltbn.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const supabaseService = {
  async syncDataToCloud(userId: string, data: any): Promise<boolean> {
    if (!userId || SUPABASE_ANON_KEY.includes('dummy_key')) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: userId, updated_at: new Date(), ...data });
      return !error;
    } catch (e) {
      console.warn("Supabase Sync push error:", e);
      return false;
    }
  },

  async pullDataFromCloud(userId: string): Promise<any | null> {
    if (!userId || SUPABASE_ANON_KEY.includes('dummy_key')) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) return null;
      return data;
    } catch (e) {
      console.warn("Supabase Sync pull error:", e);
      return null;
    }
  }
};

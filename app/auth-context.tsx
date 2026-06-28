'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'student' | 'admin' | 'superuser';
  subscription_status: 'free' | 'premium' | 'cancelled';
  industry?: string | null;
  job_role?: string | null;
  interests?: string[];
  comms_updates?: boolean;
  comms_newsletter?: boolean;
  comms_consulting?: boolean;
  comms_events?: boolean;
  marketing_consent_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    marketingOptIn?: boolean
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUser(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  async function fetchUser(userId: string) {
    console.log('Fetching user:', userId);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('User fetch response:', { data, error });
    if (error) {
      console.error('Failed to fetch user - Full error:', error);
      console.error('Error message:', error?.message);
      console.error('Error code:', error?.code);
    }
    if (data) {
      setUser(data as User);
    }
    setLoading(false);
  }

  async function signUp(
    email: string,
    password: string,
    fullName: string,
    marketingOptIn = false
  ) {
    // The public.users row (and any signup consent) is created by the
    // `handle_new_user` database trigger from this metadata — robust and not
    // dependent on a client-side insert succeeding.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          comms_updates: marketingOptIn,
          comms_newsletter: marketingOptIn,
          comms_consulting: marketingOptIn,
          comms_events: marketingOptIn,
        },
      },
    });

    if (error) throw error;
  }

  async function refreshUser() {
    if (session?.user) await fetchUser(session.user.id);
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

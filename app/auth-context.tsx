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

export interface CommsChoices {
  comms_updates: boolean;
  comms_newsletter: boolean;
  comms_consulting: boolean;
  comms_events: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    comms?: Partial<CommsChoices>
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
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUser(data as User);
    } else {
      // The session is valid but the profile row couldn't be read (an RLS
      // problem, or the trigger hasn't created the row yet). Don't strand
      // the user in a broken half-signed-in state: fall back to a minimal
      // user built from the auth session. Server-side gates (the lesson API)
      // validate the token themselves and don't rely on this object.
      if (error) console.error('Profile fetch failed:', error.message);
      const { data: sess } = await supabase.auth.getSession();
      const au = sess.session?.user;
      if (au) {
        setUser({
          id: au.id,
          email: au.email ?? '',
          full_name: (au.user_metadata?.full_name as string) || undefined,
          role: 'student',
          subscription_status: 'free',
        });
      }
    }
    setLoading(false);
  }

  async function signUp(
    email: string,
    password: string,
    fullName: string,
    comms: Partial<CommsChoices> = {}
  ) {
    // The public.users row (and any signup consent) is created by the
    // `handle_new_user` database trigger from this metadata — robust and not
    // dependent on a client-side insert succeeding. Each stream is a separate,
    // freely-given consent (UK GDPR/PECR); all default to false.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Where the confirmation email's link lands. Must also be listed in
        // Supabase → Authentication → URL Configuration → Redirect URLs.
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          comms_updates: comms.comms_updates ?? false,
          comms_newsletter: comms.comms_newsletter ?? false,
          comms_consulting: comms.comms_consulting ?? false,
          comms_events: comms.comms_events ?? false,
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

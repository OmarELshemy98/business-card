'use client';

import React, { 
    createContext, 
    useEffect, 
    useMemo, 
    useState, 
    useCallback 
} from 'react';
import { supabase } from '../../supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

type StoredUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
};

export interface AuthContextModel {
  user: SupabaseUser | null;
  profile: StoredUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const STORED_USER_KEY = 'auth:user_profile';

const authStorage = {
  saveUser(user: StoredUser): void {
    try {
      localStorage.setItem(STORED_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.warn("Failed to save user to storage", error);
    }
  },

  getUser(): StoredUser | null {
    try {
      const raw = localStorage.getItem(STORED_USER_KEY);
      return raw ? (JSON.parse(raw) as StoredUser) : null;
    } catch (error) {
      console.warn("Failed to get user from storage", error);
      return null;
    }
  },

  removeUser(): void {
    try {
      localStorage.removeItem(STORED_USER_KEY);
    } catch (error) {
      console.warn("Failed to remove user from storage", error);
    }
  },
};

export const AuthContext = createContext<AuthContextModel | undefined>(undefined);

function useProvideAuth(): AuthContextModel {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<StoredUser | null>(() => authStorage.getUser());
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const userSnapshot: StoredUser = {
          uid: session.user.id,
          email: session.user.email ?? null, // Fix type: use null instead of undefined
          displayName: session.user.user_metadata?.full_name || '',
          photoURL: session.user.user_metadata?.avatar_url || '',
          emailVerified: session.user.email_confirmed_at != null,
        };
        setProfile(userSnapshot);
        authStorage.saveUser(userSnapshot);
        await ensureUserInDB(session.user.id, session.user.email);
      } else {
        setProfile(null);
        authStorage.removeUser();
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const userSnapshot: StoredUser = {
          uid: session.user.id,
          email: session.user.email ?? null, // Fix type: use null instead of undefined
          displayName: session.user.user_metadata?.full_name || '',
          photoURL: session.user.user_metadata?.avatar_url || '',
          emailVerified: session.user.email_confirmed_at != null,
        };
        setProfile(userSnapshot);
        authStorage.saveUser(userSnapshot);
        await ensureUserInDB(session.user.id, session.user.email);
      } else {
        setProfile(null);
        authStorage.removeUser();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const ensureUserInDB = async (uid: string, email: string | undefined) => {
    try {
      // Use .maybeSingle() instead of .single() to avoid errors
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', uid)
        .maybeSingle();

      if (!existingUser) {
        await supabase
          .from('users')
          .insert({
            id: uid,
            email: email,
            name: '',
            role: 'user',
            created_at: new Date().toISOString(),
          });
      }
    } catch (error) {
      console.warn('Failed to ensure user in DB', error);
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);
  
  return useMemo(() => ({
    user,
    profile,
    isLoading,
    signIn,
    signOut,
  }), [user, profile, isLoading, signIn, signOut]);
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authData = useProvideAuth();
  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

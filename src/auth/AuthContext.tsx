// src/contexts/AuthContext.tsx
'use client';

import React, { 
    createContext, 
    useEffect, 
    useMemo, 
    useState, 
    useCallback 
} from 'react';
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Adjust path if needed

// Firestore imports for user creation
import { db } from '../../firebaseConfig';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

// ============================================================================
// 1. Types
// ============================================================================

type StoredUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
};

export interface AuthContextModel {
  user: FirebaseUser | null;    // Live, non-serializable Firebase user
  profile: StoredUser | null;   // Serializable snapshot for storage/initial load
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// ============================================================================
// 2. Storage Manager
// ============================================================================

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

// ============================================================================
// 3. Context Definition
// ============================================================================

export const AuthContext = createContext<AuthContextModel | undefined>(undefined);

// ============================================================================
// 4. Provider Component & Logic Hook
// ============================================================================

/**
 * The core logic for authentication state management.
 */
function useProvideAuth(): AuthContextModel {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<StoredUser | null>(() => authStorage.getUser());
  const [isLoading, setLoading] = useState<boolean>(true);

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userSnapshot: StoredUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        };
        setProfile(userSnapshot);
        authStorage.saveUser(userSnapshot);

        // Create user doc in Firestore if it doesn't exist (best effort, idempotent)
        try {
          // بعد ما تنشئ اليوزر وتاخد uid + email + name
          await setDoc(
            doc(db, 'users', firebaseUser.uid),
            {
              email: firebaseUser.email,
              name: firebaseUser.displayName || '',
              role: 'user', // أو 'admin'
              createdAt: serverTimestamp(),
            },
            { merge: true } // merge to avoid overwriting if exists
          );
        } catch {
          // Ignore Firestore errors here (user may already exist, etc.)
          // Optionally log: console.warn('Failed to create user doc in Firestore', err);
        }
      } else {
        setProfile(null);
        authStorage.removeUser();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    // onAuthStateChanged will handle state and storage updates
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signOut = useCallback(async () => {
    // onAuthStateChanged will handle state and storage cleanup
    await firebaseSignOut(auth);
  }, []);
  
  // Memoize the context value to prevent unnecessary re-renders of consumers
  return useMemo(() => ({
    user,
    profile,
    isLoading,
    signIn,
    signOut,
  }), [user, profile, isLoading, signIn, signOut]);
}

/**
 * Provider component that wraps your app and makes auth object available to any
 * child component that calls useAuth().
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authData = useProvideAuth();
  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

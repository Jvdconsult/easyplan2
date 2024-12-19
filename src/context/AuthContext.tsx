import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, deleteUserAccount } from '../lib/firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User,
  GoogleAuthProvider
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDevMode: boolean;
  signInWithGoogle: () => Promise<void>;
  signInDevMode: () => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const isDevMode = import.meta.env.DEV;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (!credential?.accessToken) {
        throw new Error('No access token received');
      }

      setUser(result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInDevMode = () => {
    if (!isDevMode) {
      throw new Error('Dev mode login is only available in development');
    }
    setUser({
      uid: 'dev-user',
      email: 'dev@example.com',
      displayName: 'Dev User',
      photoURL: null,
    } as User);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Get the user's access token for Google Calendar
      const idToken = await currentUser.getIdToken();

      // Revoke Google Calendar access
      try {
        await fetch('https://oauth2.googleapis.com/revoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `token=${idToken}`
        });
      } catch (error) {
        console.error('Error revoking Google access:', error);
        // Continue with deletion even if revocation fails
      }

      // Delete user data and authentication account
      await deleteUserAccount(currentUser);
      
      // Clear local state
      setUser(null);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isDevMode,
    signInWithGoogle,
    signInDevMode,
    logout,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
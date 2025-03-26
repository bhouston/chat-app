import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

// Type definitions
interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants
const AUTH_USER_KEY = 'chat_app_auth_user';
const GOOGLE_WEB_CLIENT_ID = 'YOUR_GOOGLE_WEB_CLIENT_ID'; // Replace with your actual client ID

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize Google Sign-In
  useEffect(() => {
    const configureGoogleSignIn = async () => {
      try {
        await GoogleSignin.configure({
          webClientId: GOOGLE_WEB_CLIENT_ID,
          offlineAccess: true,
        });
        setIsInitialized(true);
      } catch (error) {
        console.error('Google Sign-In configuration error:', error);
      }
    };

    configureGoogleSignIn();
  }, []);

  // Check for existing user session on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is already signed in with Firebase
        const currentUser = auth().currentUser;
        
        if (currentUser) {
          const userData: User = {
            id: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          };
          setUser(userData);
          
          // Store user data in AsyncStorage for persistence
          await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
        } else {
          // Check if we have cached user data
          const storedUser = await AsyncStorage.getItem(AUTH_USER_KEY);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async (): Promise<void> => {
    if (!isInitialized) {
      console.error('Google Sign-In is not initialized yet');
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if user is already signed in to Google
      await GoogleSignin.hasPlayServices();
      
      // Perform Google Sign-In
      const { idToken } = await GoogleSignin.signIn();
      
      // Create a Firebase credential with the Google ID token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Sign in to Firebase with the Google credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      if (userCredential.user) {
        const userData: User = {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
        };
        
        setUser(userData);
        
        // Store user data in AsyncStorage for persistence
        await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the sign-in flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.error('Google Sign-In error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Sign out from Firebase
      await auth().signOut();
      
      // Sign out from Google
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      
      // Clear user data from state and storage
      setUser(null);
      await AsyncStorage.removeItem(AUTH_USER_KEY);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isInitialized,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
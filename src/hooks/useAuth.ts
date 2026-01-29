import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Validation schemas
const emailSchema = z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" });
const passwordSchema = z.string().min(8, { message: "Password must be at least 8 characters" }).max(100, { message: "Password must be less than 100 characters" });
const displayNameSchema = z.string().trim().max(100, { message: "Name must be less than 100 characters" }).optional();

export interface AuthError {
  message: string;
  field?: 'email' | 'password' | 'displayName' | 'general';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const validateSignUpInputs = (email: string, password: string, displayName?: string): AuthError | null => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      return { message: emailResult.error.errors[0].message, field: 'email' };
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      return { message: passwordResult.error.errors[0].message, field: 'password' };
    }

    if (displayName !== undefined) {
      const nameResult = displayNameSchema.safeParse(displayName);
      if (!nameResult.success) {
        return { message: nameResult.error.errors[0].message, field: 'displayName' };
      }
    }

    return null;
  };

  const validateSignInInputs = (email: string, password: string): AuthError | null => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      return { message: emailResult.error.errors[0].message, field: 'email' };
    }

    if (!password || password.length === 0) {
      return { message: "Password is required", field: 'password' };
    }

    return null;
  };

  const signUp = async (email: string, password: string, displayName?: string): Promise<{ error: AuthError | null }> => {
    // Validate inputs
    const validationError = validateSignUpInputs(email, password, displayName);
    if (validationError) {
      return { error: validationError };
    }

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName?.trim() || email.trim().split('@')[0],
        }
      }
    });

    if (error) {
      // Handle specific error cases
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        return { error: { message: 'An account with this email already exists. Please sign in instead.', field: 'email' } };
      }
      if (error.message.includes('valid email')) {
        return { error: { message: 'Please enter a valid email address.', field: 'email' } };
      }
      if (error.message.includes('password')) {
        return { error: { message: 'Password does not meet requirements.', field: 'password' } };
      }
      return { error: { message: error.message, field: 'general' } };
    }

    // Update profile with display name if provided
    if (displayName && user) {
      await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() })
        .eq('user_id', user.id);
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    // Validate inputs
    const validationError = validateSignInInputs(email, password);
    if (validationError) {
      return { error: validationError };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: { message: 'Invalid email or password. Please try again.', field: 'general' } };
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: { message: 'Please verify your email address before signing in.', field: 'email' } };
      }
      return { error: { message: error.message, field: 'general' } };
    }

    return { error: null };
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { error: { message: error.message, field: 'general' } };
    }

    return { error: null };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!session,
  };
}

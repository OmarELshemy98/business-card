'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../../../supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { signIn } = useAuth();

  const signUp = async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
        },
      },
    });

    if (error) throw error;
    return data.user;
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoginMode && password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLoginMode) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error('Please enter your email address to reset your password.');
      return;
    }
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      toast.success('A password reset link has been sent to your email.');
    } catch {
      toast.error('Failed to send password reset email. Please check the email and try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to right, #ece9e6, #ffffff)',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 3,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {isLoginMode ? 'Welcome Back' : 'Create Account'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          {isLoginMode
            ? 'Enter your credentials to access the dashboard.'
            : 'Fill in the details below to join.'}
        </Typography>

        <form onSubmit={handleAuthAction}>
          {!isLoginMode && (
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={isSubmitting}
            />
          )}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={isSubmitting}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={isSubmitting}
          />

          {!isLoginMode && (
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={isSubmitting}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : isLoginMode ? (
              'Log In'
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {isLoginMode && (
          <Button
            onClick={handlePasswordReset}
            fullWidth
            sx={{ mt: 1, textTransform: 'none' }}
          >
            Forgot password?
          </Button>
        )}

        <Button
          onClick={() => setIsLoginMode(!isLoginMode)}
          fullWidth
          sx={{ mt: 2, textTransform: 'none' }}
        >
          {isLoginMode ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
        </Button>
      </Paper>
    </Box>
  );
}

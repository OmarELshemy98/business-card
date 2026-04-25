// src/app/providers.tsx
'use client';

import React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/auth/AuthContext';
import AuthGuard from '@/auth/AuthGuard';
import { ThemeProviderWrapper } from './themeContext'; // ⬅️ المهم

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProviderWrapper>
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
        <Toaster />
      </ThemeProviderWrapper>
    </AppRouterCacheProvider>
  );
}

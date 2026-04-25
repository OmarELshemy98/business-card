// src/auth/AuthGuard.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useAuth } from '@/app/hooks/useAuth';
import Loading from '@/app/components/Loading';
import PublicShell from '@/app/components/PublicShell';
import SystemShell from '@/app/components/SystemShell';

// A list of routes that do not require authentication
const publicRoutes = [
    '/login',
    '/reset-password',
    '/forgetpassword',
    '/email-verification',
];

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if the current route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Wait until the authentication status is confirmed
    if (isLoading) {
      return; 
    }

    // --- Redirection Logic ---

    // 1. If the user is NOT logged in and tries to access a PRIVATE route,
    //    redirect them to the login page.
    if (!user && !isPublicRoute) {
      router.push('/login');
    }

    // 2. If the user IS logged in and tries to access a PUBLIC route (like /login),
    //    redirect them to the main dashboard page.
    if (user && isPublicRoute) {
      router.push('/');
    }

  }, [user, isLoading, isPublicRoute, router, pathname]);

  // --- Rendering Logic ---

  // 1. While authentication is loading, show a full-page loader.
  if (isLoading) {
    return <Loading message="Authenticating..." />;
  }

  // 2. If a redirect is in progress (the user is on the wrong type of route),
  //    show a loader to prevent flashing the wrong content.
  if ((!user && !isPublicRoute) || (user && isPublicRoute)) {
    return <Loading message="Redirecting..." />;
  }

  // 3. If the user is allowed to be here, render the correct layout shell.
  //    The shell choice is based on the route, not the user status.
  if (isPublicRoute) {
      return <PublicShell>{children}</PublicShell>;
  } else {
      return <SystemShell>{children}</SystemShell>;
  }
};

export default AuthGuard;
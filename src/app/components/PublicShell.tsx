'use client';
import React from 'react';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  // ممكن تضيف Header/Footer للزوار هنا
  return <>{children}</>;
}

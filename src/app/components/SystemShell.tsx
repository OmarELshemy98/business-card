'use client';
import React from 'react';

export default function SystemShell({ children }: { children: React.ReactNode }) {
  // ممكن تضيف Sidebar/Navbar للمستخدم المسجّل هنا
  return <>{children}</>;
}

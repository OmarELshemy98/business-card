/**
 * Next.js Configuration
 * 
 * This file contains the Next.js configuration for the business cards application.
 * It includes settings for optimization, performance, and build configuration.
 * 
 * Purpose: Next.js framework configuration and optimization settings
 * Dependencies: Next.js
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  // experimental: {
  //   optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  // },
  
  // Image optimization settings
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  

};

export default nextConfig;

/**
 * Root layout for Samudra Paket ERP web application
 * Provides global providers and configuration
 */

import { Inter } from 'next/font/google';
import './globals.css';
// Import the client-side Providers wrapper component
import Providers from '../providers';

// Load Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Samudra Paket ERP',
  description: 'Enterprise Resource Planning system for PT. Sarana Mudah Raya',
  keywords: 'ERP, logistics, shipping, tracking, delivery, warehouse management',
  authors: [{ name: 'PT. Sarana Mudah Raya' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Samudra Paket ERP',
  },
  applicationName: 'Samudra Paket ERP',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563EB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

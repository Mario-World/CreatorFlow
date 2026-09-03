import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CreatorFlow — Agent-Native Workspace',
  description: 'Your content. Your workflow. Less busywork. An agent-native workspace that lets creators research, edit, and prepare content for different publishing platforms through agent-operable tools.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full min-h-screen bg-[#090a0d] text-[#ededed] antialiased flex flex-col font-sans`}
      >
        {children}
      </body>
    </html>
  );
}

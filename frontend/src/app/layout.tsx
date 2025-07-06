import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/redux/providers';
import AuthInitializer from '@/components/AuthInitializer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trello Lite',
  description: 'A lightweight Trello clone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthInitializer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
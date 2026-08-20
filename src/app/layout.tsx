import type { Metadata } from 'next';
import './globals.css';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'Bucolish — Find Your Place. Find Your People.',
  description:
    'Tinder-style flatmate matching platform based on lifestyle, budget, schedule, cleanliness & trust. Launching in Gurugram.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between antialiased selection:bg-purple-500 selection:text-white">
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notes App',
  description: 'Simple Notes App frontend for MCP testing project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}

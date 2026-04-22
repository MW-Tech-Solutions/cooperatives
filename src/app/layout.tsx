import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'CoopNest - Cooperative Society Management',
  description: 'Smart, secure governance for cooperative societies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {/* Prevent NotAllowedError: Clipboard access in sandboxed environments */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('unhandledrejection', function(event) {
            if (event.reason && (event.reason.name === 'NotAllowedError' || event.reason.message.includes('Clipboard'))) {
              console.warn('Clipboard access blocked by browser policy');
              event.preventDefault();
            }
          });
        `}} />
      </head>
      <body className="font-body antialiased selection:bg-primary/30">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

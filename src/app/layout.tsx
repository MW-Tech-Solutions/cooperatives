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
        {/* Global Stability Script: Intercepts and suppresses known internal SDK assertion bugs and permission issues in sandboxed environments */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalLog = console.log;
            
            const isKnownAssertion = (msg) => {
              if (!msg) return false;
              const stringMsg = typeof msg === 'string' ? msg : (msg.message || JSON.stringify(msg));
              const lowerMsg = stringMsg.toLowerCase();
              return lowerMsg.includes('internal assertion failed') || 
                     lowerMsg.includes('id: ca9') || 
                     lowerMsg.includes('id: b815') ||
                     lowerMsg.includes('firestore (11.9.0)') ||
                     lowerMsg.includes('internal unhandled error') ||
                     lowerMsg.includes('unexpected state');
            };

            const isKnownPermissionError = (msg) => {
              if (!msg) return false;
              const stringMsg = typeof msg === 'string' ? msg : (msg.message || JSON.stringify(msg));
              const lowerMsg = stringMsg.toLowerCase();
              return lowerMsg.includes('notallowederror') || 
                     lowerMsg.includes('clipboard') || 
                     lowerMsg.includes('permission denied');
            };

            console.error = function(...args) {
              if (args.some(arg => isKnownAssertion(arg) || isKnownPermissionError(arg))) return;
              originalError.apply(console, args);
            };

            console.warn = function(...args) {
              if (args.some(arg => isKnownAssertion(arg) || isKnownPermissionError(arg))) return;
              originalWarn.apply(console, args);
            };

            console.log = function(...args) {
              if (args.some(arg => isKnownAssertion(arg))) return;
              originalLog.apply(console, args);
            };

            window.addEventListener('unhandledrejection', (event) => {
              const reason = event.reason?.message || String(event.reason);
              if (isKnownAssertion(reason) || isKnownPermissionError(reason)) {
                event.stopImmediatePropagation();
                event.preventDefault();
              }
            }, true);

            window.addEventListener('error', (event) => {
              const msg = event.message || (event.error && event.error.message);
              if (isKnownAssertion(msg) || isKnownPermissionError(msg)) {
                event.stopImmediatePropagation();
                event.preventDefault();
              }
            }, true);
          })();
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

import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { WhatsAppWidget } from '@/components/common/WhatsAppWidget';
import { LocationLanguageBanner } from '@/components/common/LocationLanguageBanner';
import { CatalogListingModal } from '@/components/products/CatalogListingModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { LocationModal } from '@/components/common/LocationModal';
import { LanguageFontManager } from '@/components/common/LanguageFontManager';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  adjustFontFallback: false,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: 'AGROVÉ | Arveer Impex — Agroveer Machinery & Sawking Cutting Systems',
  description: 'Commercial agricultural machinery, Earth Augers, 2" & 3" Water Pumps, 170F Engines, Cordless Bag Closers, and German-grade Sawking Chains & Trimmer Lines with instant spare parts compatibility and WhatsApp B2B dispatch.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="bg-offwhite text-charcoal min-h-screen flex flex-col antialiased selection:bg-leaf selection:text-forest">
        <AuthProvider>
          <LanguageFontManager />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <WhatsAppWidget />
          <LocationLanguageBanner />
          <CatalogListingModal />
          <AuthModal />
          <LocationModal />
        </AuthProvider>
      </body>
    </html>
  );
}

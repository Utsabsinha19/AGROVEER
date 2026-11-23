import React from 'react';
import { Metadata } from 'next';
import { WishlistClient } from './WishlistClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Saved Machinery & Wishlist | Arveer Impex — Agroveer & Sawking',
  description: 'View your saved agricultural machinery, compare specifications, and move items directly to your commercial cart for instant dispatch.',
};

export default function WishlistPage() {
  return <WishlistClient />;
}


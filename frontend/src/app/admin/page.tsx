import React from 'react';
import { Metadata } from 'next';
import { AdminClient } from './AdminClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'B2B Admin & Inventory Operations Portal | Arveer Impex',
  description: 'Manage central distribution inventory, wholesale dealer dispatches, and Cloudinary media assets.',
};

export default function AdminPage() {
  return <AdminClient />;
}

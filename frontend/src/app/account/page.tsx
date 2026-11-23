import React from 'react';
import { Metadata } from 'next';
import { AccountClient } from './AccountClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Buyer Account & Commercial Warranty Vault | Arveer Impex',
  description: 'Manage active machinery orders, track road freight consignments, verify laser engine serial warranties, and download official GST tax invoices.',
};

export default function AccountPage() {
  return <AccountClient />;
}


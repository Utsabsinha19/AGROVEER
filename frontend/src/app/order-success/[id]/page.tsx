import React from 'react';
import { Metadata } from 'next';
import { OrderSuccessClient } from './OrderSuccessClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Order Dispatch Confirmation | Arveer Impex — Agroveer & Sawking',
  description: 'Official order confirmation, freight LR tracking, and printable GST tax invoice for commercial agricultural machinery.',
};

export default function OrderSuccessPage({ params }: PageProps) {
  return <OrderSuccessClient orderId={params.id} />;
}

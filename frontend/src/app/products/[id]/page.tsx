import React from 'react';
import { Metadata } from 'next';
import { PRODUCTS } from '@/data/products';
import { ProductDetailClient } from './ProductDetailClient';

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export const dynamicParams = true;

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = PRODUCTS.find((p) => p.id === params.id);
  if (!product) {
    return {
      title: 'Equipment Detail | Arveer Impex — Agroveer & Sawking',
    };
  }
  return {
    title: `${product.name} | Arveer Impex Commercial Dispatch`,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  return <ProductDetailClient productId={params.id} />;
}

'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Upload, 
  Video, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Sparkles, 
  Cloud, 
  RefreshCw,
  Eye,
  FileCheck,
  Check
} from 'lucide-react';
import { Product, ProductCategory, ProductBrand } from '@/types';
import { formatCurrency } from '@/lib/utils';

export interface UploadedAsset {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: 'image' | 'video';
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  created_at?: string;
}

const CATEGORIES: ProductCategory[] = [
  'Farm Machinery & Engines',
  'Agriculture Water Pumps',
  'Earth Augers & Boring',
  'Packaging & Bag Closers',
  'Cutting Tools & Consumables',
  'Power Equipment Spares',
];

interface SellerProductUploaderProps {
  onProductCreated?: (newProduct: Product) => void;
}

export const SellerProductUploader: React.FC<SellerProductUploaderProps> = ({ onProductCreated }) => {
  // Cloudinary Status
  const [cloudStatus, setCloudStatus] = useState<{ checked: boolean; connected: boolean; cloudName: string }>({
    checked: false,
    connected: false,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  });

  // Media Upload States
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [recentAssets, setRecentAssets] = useState<UploadedAsset[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Form Fields for the Product
  const [name, setName] = useState('');
  const [brand, setBrand] = useState<ProductBrand>('Agroveer');
  const [category, setCategory] = useState<ProductCategory>('Farm Machinery & Engines');
  const [price, setPrice] = useState<number>(8499);
  const [originalPrice, setOriginalPrice] = useState<number>(10500);
  const [sku, setSku] = useState('AV-NEW-MODEL');
  const [inventoryCount, setInventoryCount] = useState<number>(50);
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [scientificName, setScientificName] = useState('');
  
  // Media URLs
  const [imageUrl, setImageUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  
  // Dynamic Specs
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([
    { label: 'Engine / Power Model', value: '170F 7.5 HP OHV' },
    { label: 'Shaft / Drive Fitting', value: 'Keyed 20mm Horizontal Shaft' },
    { label: 'Frame Structure', value: '25mm Double-Handle Tubular Steel' }
  ]);

  // Dynamic Key Benefits
  const [benefits, setBenefits] = useState<string[]>([
    'Super Easy Starter mechanism reduces pull resistance by 35%',
    'Guaranteed genuine OEM replacement parts in central stock',
    'Pan-India freight dispatch with GST input tax credit invoice'
  ]);

  const [publishedProduct, setPublishedProduct] = useState<Product | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Test Cloudinary Ping
  const testCloudinaryConnection = async () => {
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      const defaultCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
      if (data.success && data.status === 'connected') {
        setCloudStatus({ checked: true, connected: true, cloudName: data.cloudName || defaultCloud });
      } else {
        setCloudStatus({ checked: true, connected: false, cloudName: defaultCloud });
      }
    } catch {
      setCloudStatus({ checked: true, connected: false, cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '' });
    }
  };

  // Upload file (Image or Video) to Cloudinary
  const handleUploadFile = async (file: File, type: 'image' | 'video') => {
    setUploadError(null);
    if (type === 'image') setIsUploadingImage(true);
    if (type === 'video') setIsUploadingVideo(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'agrove_machinery');
      formData.append('resource_type', type === 'video' ? 'video' : 'image');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Cloudinary upload failed');
      }

      const asset: UploadedAsset = json.data;

      // Add to recent assets
      setRecentAssets((prev) => [asset, ...prev]);

      // Assign to form
      if (type === 'image') {
        setImageUrl(asset.secure_url);
      } else {
        setVideoUrl(asset.secure_url);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Failed to upload asset to Cloudinary.');
    } finally {
      setIsUploadingImage(false);
      setIsUploadingVideo(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { label: 'New Specification', value: 'Value' }]);
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const handleUpdateSpec = (idx: number, field: 'label' | 'value', val: string) => {
    const updated = [...specs];
    updated[idx][field] = val;
    setSpecs(updated);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, 'New product advantage / specification detail']);
  };

  const handleRemoveBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const handleUpdateBenefit = (idx: number, val: string) => {
    const updated = [...benefits];
    updated[idx] = val;
    setBenefits(updated);
  };

  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (!name.trim()) {
      setUploadError('Product name is required.');
      return;
    }

    if (!imageUrl) {
      setUploadError('Please upload a product image to Cloudinary first.');
      return;
    }

    const newId = `${brand.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const exGst = Math.round(price / 1.05);

    const newProduct: Product = {
      id: newId,
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      brand,
      name,
      scientificName: scientificName.trim() || `${name} — Professional Grade`,
      tagline: tagline.trim() || 'Heavy-duty agricultural equipment engineered for maximum durability and reliability.',
      category,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price) + 2000,
      exGstPrice: exGst,
      gstRate: 0.05,
      rating: 5.0,
      reviewCount: 1,
      image: imageUrl,
      videoUrl: videoUrl || undefined,
      badges: [
        brand === 'Sawking' ? 'German Quality' : 'Kisan Ki Pasand',
        'OEM Genuine',
        category
      ],
      inStock: true,
      inventoryCount: Number(inventoryCount) || 25,
      description: description.trim() || tagline.trim() || 'Heavy-duty equipment built for demanding farm conditions.',
      detailedDescription: description.trim() || 'Engineered to deliver high-performance duty with precision tolerance and standardized spare parts availability.',
      organicCertified: false,
      volumeOrWeight: '1 Complete Unit',
      keyBenefits: benefits.filter(Boolean),
      composition: [
        { name: 'Distribution', percentage: 'Arveer Impex Authorized' },
        { name: 'Warranty', percentage: 'Standard Commercial Warranty' }
      ],
      specs: specs.filter((s) => s.label && s.value),
      featured: true,
      bestSeller: false
    };

    setPublishedProduct(newProduct);
    if (onProductCreated) {
      onProductCreated(newProduct);
    }
  };

  return (
    <div className="space-y-8 text-charcoal">
      {/* Cloudinary Header Status Card */}
      <div className="p-6 rounded-3xl bg-[#102C22] text-[#F7F5F0] border border-[rgba(166,201,106,0.2)] shadow-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#24583D] flex items-center justify-center text-[#A6C96A] border border-[#A6C96A]/30">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
              <h3 className="font-serif text-lg font-bold text-[#F7F5F0]">
                Cloudinary Media Pipeline Connected
              </h3>
            </div>
            <p className="text-xs text-[#F7F5F0]/70 font-mono mt-0.5">
              Cloud Name: <strong className="text-[#A6C96A]">{cloudStatus.cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Configured via .env'}</strong> • Direct Secure HTTPS CDN Delivery
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={testCloudinaryConnection}
          className="px-4 py-2 rounded-xl bg-[#141A17] hover:bg-[#1A2420] border border-[rgba(166,201,106,0.25)] text-xs text-[#A6C96A] font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{cloudStatus.checked ? (cloudStatus.connected ? 'Cloudinary Verified (OK)' : 'Re-check Connection') : 'Verify Cloudinary Handshake'}</span>
        </button>
      </div>

      {uploadError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Success Notification after Product Publish */}
      {publishedProduct && (
        <div className="p-6 rounded-3xl bg-green-50 border border-green-200 text-green-900 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-green-900">
                  Product Successfully Published with Cloudinary Assets!
                </h4>
                <p className="text-xs text-green-800 mt-1">
                  <strong>{publishedProduct.name}</strong> ({publishedProduct.sku}) is now active in the platform catalog.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-green-200 font-mono text-[11px] text-green-800">
                    Image: {publishedProduct.image}
                  </span>
                  {publishedProduct.videoUrl && (
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-green-200 font-mono text-[11px] text-green-800">
                      Video: {publishedProduct.videoUrl}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link
              href={`/products/${publishedProduct.id}`}
              className="px-4 py-2 rounded-xl bg-[#24583D] hover:bg-[#1B4731] text-[#F7F5F0] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <span>View Product Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Two Column Grid: Media Uploader on Left, Product Info on Right */}
      <form onSubmit={handlePublishProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cloudinary Media Upload Box */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Image Upload Box */}
          <div className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.22)] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#141A17] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#24583D]" />
                <span>Upload Product Image</span>
              </h3>
              <span className="text-[10px] uppercase font-bold text-[#24583D] bg-[#24583D]/10 px-2 py-0.5 rounded">
                Cloudinary Asset
              </span>
            </div>

            {/* Hidden File Input */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadFile(file, 'image');
              }}
            />

            {imageUrl ? (
              <div className="space-y-3">
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-[#F7F5F0] border border-[rgba(166,201,106,0.2)] p-2 flex items-center justify-center">
                  <Image
                    src={imageUrl}
                    alt="Uploaded Product Preview"
                    fill
                    className="object-contain p-2"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                    Cloudinary CDN
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={imageUrl}
                    className="flex-1 bg-[#F7F5F0] border border-[rgba(166,201,106,0.2)] rounded-xl px-3 py-1.5 text-[11px] font-mono text-charcoal"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(imageUrl)}
                    className="p-2 rounded-xl bg-white border border-[rgba(166,201,106,0.25)] text-[#24583D] hover:bg-[#F7F5F0]"
                    title="Copy Cloudinary URL"
                  >
                    {copiedUrl === imageUrl ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-[#24583D] text-[#F7F5F0] text-xs font-semibold"
                  >
                    Replace
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="border-2 border-dashed border-[rgba(166,201,106,0.35)] hover:border-[#24583D] rounded-2xl p-8 text-center bg-[#F7F5F0]/60 hover:bg-[#F7F5F0] cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-[rgba(166,201,106,0.2)] flex items-center justify-center text-[#24583D] group-hover:scale-110 transition-transform">
                  {isUploadingImage ? <RefreshCw className="w-6 h-6 animate-spin text-[#24583D]" /> : <Upload className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141A17]">
                    {isUploadingImage ? 'Uploading directly to Cloudinary...' : 'Click to Upload High-Res Image'}
                  </p>
                  <p className="text-[11px] text-[#78877D] mt-0.5">
                    Supports PNG, JPG, WEBP (stored in agrove_machinery folder)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 2. Video Upload Box */}
          <div className="p-6 rounded-3xl bg-white border border-[rgba(166,201,106,0.22)] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#141A17] flex items-center gap-2">
                <Video className="w-4 h-4 text-[#24583D]" />
                <span>Upload Factory Walkaround Video</span>
              </h3>
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded">
                Cloudinary Video CDN
              </span>
            </div>

            {/* Hidden Video Input */}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadFile(file, 'video');
              }}
            />

            {videoUrl ? (
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden bg-black border border-[rgba(166,201,106,0.2)] max-h-56 flex items-center justify-center">
                  <video controls className="w-full h-auto max-h-56" src={videoUrl}>
                    Your browser does not support video.
                  </video>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={videoUrl}
                    className="flex-1 bg-[#F7F5F0] border border-[rgba(166,201,106,0.2)] rounded-xl px-3 py-1.5 text-[11px] font-mono text-charcoal"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(videoUrl)}
                    className="p-2 rounded-xl bg-white border border-[rgba(166,201,106,0.25)] text-[#24583D] hover:bg-[#F7F5F0]"
                    title="Copy Cloudinary Video URL"
                  >
                    {copiedUrl === videoUrl ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-[#24583D] text-[#F7F5F0] text-xs font-semibold"
                  >
                    Replace
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => videoInputRef.current?.click()}
                className="border-2 border-dashed border-[rgba(166,201,106,0.35)] hover:border-[#24583D] rounded-2xl p-8 text-center bg-[#F7F5F0]/60 hover:bg-[#F7F5F0] cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-[rgba(166,201,106,0.2)] flex items-center justify-center text-[#24583D] group-hover:scale-110 transition-transform">
                  {isUploadingVideo ? <RefreshCw className="w-6 h-6 animate-spin text-[#24583D]" /> : <Video className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141A17]">
                    {isUploadingVideo ? 'Uploading video to Cloudinary...' : 'Click to Upload Factory Video'}
                  </p>
                  <p className="text-[11px] text-[#78877D] mt-0.5">
                    Supports MP4, WEBM, MOV (optimized for streaming CDN)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Cloudinary Uploads Vault */}
          {recentAssets.length > 0 && (
            <div className="p-5 rounded-3xl bg-white border border-[rgba(166,201,106,0.22)] shadow-sm space-y-3">
              <h4 className="font-serif text-xs font-bold text-[#141A17] uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#24583D]" />
                <span>Recently Uploaded Cloudinary Assets ({recentAssets.length})</span>
              </h4>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {recentAssets.map((asset, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#F7F5F0] border border-[rgba(166,201,106,0.15)] flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      {asset.resource_type === 'video' ? <Video className="w-4 h-4 text-amber-600 shrink-0" /> : <ImageIcon className="w-4 h-4 text-[#24583D] shrink-0" />}
                      <span className="font-mono text-[11px] text-charcoal truncate">{asset.public_id}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyUrl(asset.secure_url)}
                      className="px-2 py-1 rounded bg-white border border-[rgba(166,201,106,0.25)] text-[10px] font-bold text-[#24583D] hover:bg-[#24583D] hover:text-white transition-colors"
                    >
                      {copiedUrl === asset.secure_url ? 'Copied!' : 'Copy URL'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Product Metadata Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[rgba(166,201,106,0.22)] shadow-sm space-y-5">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#141A17]">
                Product & Machinery Specification Dossier
              </h3>
              <p className="text-xs text-[#78877D] mt-0.5">
                Information entered here will be rendered across the e-commerce catalog, 3D inspection views, and B2B invoices.
              </p>
            </div>

            {/* Brand & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Brand Selection *</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as ProductBrand)}
                  className="w-full bg-[#F7F5F0] border border-[rgba(166,201,106,0.22)] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] font-semibold focus:outline-none focus:border-[#24583D]"
                >
                  <option value="Agroveer">Agroveer™ (Kisan Ki Pasand)</option>
                  <option value="Sawking">Sawking™ (German Quality)</option>
                  <option value="Arveer Impex">Arveer Impex™ (Spares & Attachments)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Product Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full bg-[#F7F5F0] border border-[rgba(166,201,106,0.22)] rounded-xl px-3.5 py-2.5 text-xs text-[#141A17] font-semibold focus:outline-none focus:border-[#24583D]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Name & SKU */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agroveer™ 170F 7.5 HP Petrol Engine with Pulley"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-[rgba(166,201,106,0.22)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#141A17] focus:outline-none focus:border-[#24583D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Part SKU / Code</label>
                <input
                  type="text"
                  placeholder="e.g. AV-170F-PULLEY"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-[rgba(166,201,106,0.22)] rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase text-[#141A17] focus:outline-none focus:border-[#24583D]"
                />
              </div>
            </div>

            {/* Model Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-[#141A17] mb-1">Technical Descriptor / Model Title</label>
              <input
                type="text"
                placeholder="e.g. 212cc 4-Stroke OHV Utility Petrol Engine with Key Shaft"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
                className="w-full bg-[#F7F5F0] border border-[rgba(166,201,106,0.22)] rounded-xl px-3.5 py-2 text-xs text-[#141A17] focus:outline-none focus:border-[#24583D]"
              />
            </div>

            {/* Price Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Price (₹ INR incl. 5% GST) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-[#F7F5F0] border border-[rgba(166,201,106,0.22)] rounded-xl px-3.5 py-2 text-xs font-bold text-[#141A17] focus:outline-none focus:border-[#24583D]"
                />
                <span className="text-[10px] text-[#78877D] mt-0.5 block">Ex. GST: ₹{Math.round(price / 1.05)}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">MRP Original Price (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full bg-[#F7F5F0] border border-[rgba(166,201,106,0.22)] rounded-xl px-3.5 py-2 text-xs text-[#141A17] focus:outline-none focus:border-[#24583D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141A17] mb-1">Initial Stock Units</label>
                <input
                  type="number"
                  min="0"
                  value={inventoryCount}
                  onChange={(e) => setInventoryCount(Number(e.target.value))}
                  className="w-full bg-[#F7F5F0] border border-[rgba(166,201,106,0.22)] rounded-xl px-3.5 py-2 text-xs text-[#141A17] focus:outline-none focus:border-[#24583D]"
                />
              </div>
            </div>

            {/* Tagline & Description */}
            <div>
              <label className="block text-xs font-semibold text-[#141A17] mb-1">Tagline (High-Impact 1-Liner)</label>
              <input
                type="text"
                placeholder="High-performance workhorse with fitted pulley for weeders & pumps"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#F7F5F0] border border-[rgba(166,201,106,0.22)] rounded-xl px-3.5 py-2 text-xs text-[#141A17] focus:outline-none focus:border-[#24583D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#141A17] mb-1">Full Detailed Engineering Description</label>
              <textarea
                rows={3}
                placeholder="Describe engine architecture, cooling system, build quality, warranty terms..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#F7F5F0] border border-[rgba(166,201,106,0.22)] rounded-xl px-3.5 py-2 text-xs text-[#141A17] focus:outline-none focus:border-[#24583D]"
              />
            </div>

            {/* Dynamic Technical Specs Builder */}
            <div className="space-y-3 pt-2 border-t border-[rgba(166,201,106,0.18)]">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-[#141A17] tracking-wider">
                  Technical Specifications ({specs.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="text-xs font-bold text-[#24583D] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Spec Row</span>
                </button>
              </div>

              <div className="space-y-2">
                {specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Spec Label (e.g. Shaft Type)"
                      value={spec.label}
                      onChange={(e) => handleUpdateSpec(idx, 'label', e.target.value)}
                      className="w-1/3 bg-[#F7F5F0] border border-[rgba(166,201,106,0.2)] rounded-xl px-3 py-1.5 text-xs text-[#141A17]"
                    />
                    <input
                      type="text"
                      placeholder="Spec Value (e.g. 20mm Keyed)"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                      className="flex-1 bg-[#F7F5F0] border border-[rgba(166,201,106,0.2)] rounded-xl px-3 py-1.5 text-xs text-[#141A17]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-1.5 text-red-500 hover:text-red-700"
                      title="Remove row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Key Benefits Builder */}
            <div className="space-y-3 pt-2 border-t border-[rgba(166,201,106,0.18)]">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-[#141A17] tracking-wider">
                  Key Engineering Advantages ({benefits.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="text-xs font-bold text-[#24583D] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Bullet</span>
                </button>
              </div>

              <div className="space-y-2">
                {benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => handleUpdateBenefit(idx, e.target.value)}
                      className="flex-1 bg-[#F7F5F0] border border-[rgba(166,201,106,0.2)] rounded-xl px-3 py-1.5 text-xs text-[#141A17]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(idx)}
                      className="p-1.5 text-red-500 hover:text-red-700"
                      title="Remove bullet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Publish CTA Button */}
            <div className="pt-4 border-t border-[rgba(166,201,106,0.22)]">
              <button
                type="submit"
                disabled={isUploadingImage || isUploadingVideo}
                className="w-full py-4 px-6 rounded-2xl bg-[#24583D] hover:bg-[#1B4731] text-[#F7F5F0] hover:text-[#FFFFFF] font-bold text-xs uppercase tracking-wider transition-all duration-300 border border-[#24583D] hover:border-[#A6C96A] shadow-botanical hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#A6C96A]" />
                <span>Publish Machinery with Cloudinary Media to Website</span>
              </button>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};

# -*- coding: utf-8 -*-
"""
AGROVEER Complete Platform Requirements & Discovery Specification (Exhaustive Master Edition)
Implements all 12 required outputs and sections A-K from the Master Prompt
with strict 8-column tables, product catalog dictionary, asset guidelines,
business questionnaire, developer access protocol, RACI matrix, and risk analysis.
"""

import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AGROVEER — Complete Platform Requirements &amp; Discovery Master Blueprint</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm 10mm 12mm 10mm;
      @bottom-right {
        content: "Page " counter(page);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7pt;
        color: #718096;
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 7.2pt;
      line-height: 1.35;
      color: #2D3748;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4 {
      color: #102C22;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 4px;
    }

    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 17pt;
      line-height: 1.15;
      color: #102C22;
      letter-spacing: -0.4px;
    }

    h2 {
      font-size: 10pt;
      border-bottom: 1.5px solid #24583D;
      padding-bottom: 3px;
      margin-top: 10px;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    h2 .section-code {
      background: #102C22;
      color: #A6C96A;
      font-size: 6.8pt;
      padding: 1.5px 5px;
      border-radius: 3px;
      font-family: 'JetBrains Mono', monospace;
    }

    h3 {
      font-size: 8.5pt;
      color: #24583D;
      margin-top: 6px;
      margin-bottom: 3px;
    }

    p {
      margin-top: 0;
      margin-bottom: 4px;
      text-align: justify;
    }

    .lead-text {
      font-size: 7.6pt;
      color: #4A5568;
      line-height: 1.4;
    }

    .page-break {
      page-break-before: always;
    }

    .no-break {
      page-break-inside: avoid;
    }

    /* Header & Cover Banner */
    .doc-header {
      background: linear-gradient(135deg, #102C22 0%, #17382B 60%, #24583D 100%);
      color: #FFFFFF;
      padding: 12px 15px;
      border-radius: 6px;
      margin-bottom: 8px;
      border-left: 5px solid #A6C96A;
    }

    .doc-header .brand-title {
      font-family: 'Playfair Display', serif;
      font-size: 17pt;
      font-weight: 700;
      color: #F7F5F0;
      margin: 0;
      letter-spacing: 0.4px;
    }

    .doc-header .brand-title span {
      color: #A6C96A;
    }

    .doc-header .subtitle {
      font-size: 8.8pt;
      font-weight: 600;
      color: #E2E8F0;
      margin-top: 2px;
      margin-bottom: 5px;
    }

    .doc-meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      background: rgba(255, 255, 255, 0.08);
      padding: 5px 8px;
      border-radius: 4px;
      font-size: 6.8pt;
      border: 1px solid rgba(166, 201, 106, 0.2);
    }

    .doc-meta-item strong {
      color: #A6C96A;
      display: block;
      text-transform: uppercase;
      font-size: 5.8pt;
      letter-spacing: 0.4px;
      margin-bottom: 1px;
    }

    /* Badges & Status */
    .badge {
      display: inline-block;
      padding: 1px 3.5px;
      border-radius: 2px;
      font-size: 6pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }

    .badge-critical {
      background: #FED7D7;
      color: #9B2C2C;
      border: 1px solid #FEB2B2;
    }

    .badge-high {
      background: #FEEBC8;
      color: #C05621;
      border: 1px solid #FBD38D;
    }

    .badge-medium {
      background: #EBF8FF;
      color: #2B6CB0;
      border: 1px solid #BEE3F8;
    }

    .badge-optional {
      background: #EDF2F7;
      color: #4A5568;
      border: 1px solid #CBD5E0;
    }

    .badge-ready {
      background: #C6F6D5;
      color: #22543D;
      border: 1px solid #9AE6B4;
    }

    /* 8-Column Master Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
      font-size: 6.8pt;
    }

    th {
      background-color: #102C22;
      color: #FFFFFF;
      text-align: left;
      padding: 3.5px 4px;
      font-weight: 600;
      font-size: 6.4pt;
      text-transform: uppercase;
      letter-spacing: 0.2px;
      border: 1px solid #102C22;
    }

    td {
      padding: 3px 4px;
      border: 1px solid #E2E8F0;
      vertical-align: top;
      line-height: 1.25;
    }

    tr:nth-child(even) td {
      background-color: #F8FAF9;
    }

    /* Callout Boxes */
    .callout {
      padding: 5px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
      font-size: 7pt;
      line-height: 1.35;
    }

    .callout-warning {
      background-color: #FFFDF5;
      border-left: 3px solid #DD6B20;
      border-right: 1px solid #FEEBC8;
      border-top: 1px solid #FEEBC8;
      border-bottom: 1px solid #FEEBC8;
      color: #7B341E;
    }

    .callout-info {
      background-color: #F0FFF4;
      border-left: 3px solid #24583D;
      border-right: 1px solid #C6F6D5;
      border-top: 1px solid #C6F6D5;
      border-bottom: 1px solid #C6F6D5;
      color: #1C4532;
    }

    .callout-danger {
      background-color: #FFF5F5;
      border-left: 3px solid #E53E3E;
      border-right: 1px solid #FED7D7;
      border-top: 1px solid #FED7D7;
      border-bottom: 1px solid #FED7D7;
      color: #9B2C2C;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-bottom: 6px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 5px;
      margin-bottom: 6px;
    }

    .card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 4px;
      padding: 5px 7px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }

    .card-title {
      font-size: 7.4pt;
      font-weight: 700;
      color: #102C22;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .code-span {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.2pt;
      background: #EDF2F7;
      padding: 0.5px 2.5px;
      border-radius: 2px;
      color: #2D3748;
    }

    ul, ol {
      margin-top: 2px;
      margin-bottom: 4px;
      padding-left: 12px;
    }

    li {
      margin-bottom: 1.5px;
    }

    .status-check {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      color: #718096;
    }

    .page-footer {
      border-top: 1px solid #E2E8F0;
      padding-top: 4px;
      margin-top: 8px;
      font-size: 6.4pt;
      color: #718096;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="doc-header">
    <div class="brand-title">AGROVÉ<span>ER</span> &amp; SA<span>W</span>KING</div>
    <div class="subtitle">Complete Platform Requirements, Resource Discovery &amp; Technical Master Specification</div>
    <div class="doc-meta-grid">
      <div class="doc-meta-item">
        <strong>Document Code</strong>
        AGR-DISC-2026-V2.0
      </div>
      <div class="doc-meta-item">
        <strong>Operating Entity</strong>
        Arveer Impex Distribution
      </div>
      <div class="doc-meta-item">
        <strong>Target Launch</strong>
        Commercial Q1 2026
      </div>
      <div class="doc-meta-item">
        <strong>Architecture</strong>
        Next.js 14 • Neon DB • Razorpay
      </div>
    </div>
  </div>

  <div class="callout callout-info">
    <strong>Executive Discovery Objective:</strong> This master document provides the exhaustive, item-by-item checklist of corporate information, commercial product data, media assets, logistics agreements, legal frameworks, and cloud authorizations required from <strong>Arveer Impex (Agroveer)</strong>. Every single item details <em>what</em> is needed, <em>why</em> it is required, the <em>preferred format</em>, <em>priority level</em>, <em>responsible owner</em>, <em>target delivery phase</em>, and <em>current readiness status</em>.
  </div>

  <h2>1. Platform Architecture &amp; Hybrid E-Commerce Scope <span class="section-code">SEC-01</span></h2>
  <p class="lead-text">
    <strong>AGROVEER</strong> is planned as India's premier responsive agricultural machinery e-commerce platform. It unifies a consumer retail storefront (Farmer Direct) with a specialized <strong>B2B Commercial Dealer &amp; Workshop Portal</strong>. The system encompasses interactive 3D WebGL machinery exploration, real-time GPS state detection with automatic vernacular language and font switching (8 Indian regional languages), Razorpay payment processing, and commercial road transport Lorry Receipt (Bilty) consignment tracking.
  </p>

  <div class="grid-3">
    <div class="card">
      <div class="card-title">Commercial Machinery Portal</div>
      <p style="font-size: 6.8pt; color: #4A5568;">Direct sales &amp; wholesale orders for petrol engines (170F 7.5HP), brush cutters, high-flow water pumps, tillers, and chainsaws with laser-serial warranty binding.</p>
    </div>
    <div class="card">
      <div class="card-title">3D Interactive Station</div>
      <p style="font-size: 6.8pt; color: #4A5568;">Three.js &amp; WebGL exploded parts visualization, 360° inspection, and maintenance guidance for technical buyers and workshops.</p>
    </div>
    <div class="card">
      <div class="card-title">Multilingual &amp; GPS Engine</div>
      <p style="font-size: 6.8pt; color: #4A5568;">Real-time geolocation resolving Indian states &amp; districts with dynamic switching across 8 languages and native regional Google font stacks.</p>
    </div>
  </div>

  <h2>2. "Send These First" — Top 15 Highest Priority Launch Blockers <span class="section-code">SEC-02</span></h2>
  <p>These 15 items constitute the critical path. Missing any of these blocks visual design, payment gateway activation, or order fulfillment.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 18px;">#</th>
        <th style="width: 105px;">Item</th>
        <th>What to Provide / Confirm</th>
        <th style="width: 95px;">Preferred Format</th>
        <th style="width: 48px;">Priority</th>
        <th style="width: 55px;">Owner</th>
        <th style="width: 65px;">Needed By</th>
        <th style="width: 65px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>01</td>
        <td><strong>Entity &amp; GSTIN</strong></td>
        <td>Official registered business name, Certificate of Incorporation, GSTIN Certificate, and registered office address.</td>
        <td>PDF / Govt Certificate</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client MD</td>
        <td>Before Design</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>02</td>
        <td><strong>Product Catalog CSV</strong></td>
        <td>Structured spreadsheet of all active SKUs, HSN codes (8407/8432/8433), MRP, dealer price, weight, and GST rates.</td>
        <td>Structured XLSX / CSV</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Inventory Lead</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>03</td>
        <td><strong>Razorpay Live Account</strong></td>
        <td>Activated Razorpay business account invite with verified bank settlement account for NEFT/UPI/Card transactions.</td>
        <td>Team Invite (Admin)</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Accounts</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>04</td>
        <td><strong>Brand Vector Logos</strong></td>
        <td>Official vector assets (SVG, AI, EPS, transparent PNG &gt;2000px) for AGROVEER and SAWING, plus brand style guide.</td>
        <td>SVG / AI / EPS</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Marketing</td>
        <td>Before Design</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>05</td>
        <td><strong>Road Freight Carriers</strong></td>
        <td>Confirmed partnerships with road logistics carriers (V-Trans, TCI Freight, Safexpress) and godown delivery hubs.</td>
        <td>Carrier Rate Card / PDF</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Logistics Head</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>06</td>
        <td><strong>Machinery Warranty</strong></td>
        <td>Official warranty duration (6/12/24 mo.), covered mechanical parts, excluded consumables, and repair protocol.</td>
        <td>Word Doc / PDF</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Technical Dir.</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>07</td>
        <td><strong>Studio Photography</strong></td>
        <td>Clean studio images (white/transparent background, &gt;2400px): hero 45°, controls, PTO shaft, barcode serial, accessories.</td>
        <td>PNG / WebP / JPG</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Creative Lead</td>
        <td>Before Design</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>08</td>
        <td><strong>3D CAD / GLB Models</strong></td>
        <td>Optimized 3D models (&lt;8MB, &lt;85k polys, PBR textures) for 170F Engine, Brush Cutter, and Water Pump.</td>
        <td>Binary GLTF (.glb)</td>
        <td><span class="badge badge-high">High</span></td>
        <td>3D CAD Studio</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>09</td>
        <td><strong>Domain Registrar Access</strong></td>
        <td>Access or delegated permissions on domain registrar (Cloudflare, GoDaddy) for production DNS routing.</td>
        <td>DNS Delegate Invite</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>IT Admin</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>10</td>
        <td><strong>Email Sending Domain</strong></td>
        <td>Dedicated sending subdomain (<span class="code-span">mail.agroveer.com</span>) with SPF, DKIM, and DMARC TXT records configured.</td>
        <td>DNS Records Ready</td>
        <td><span class="badge badge-high">High</span></td>
        <td>IT / Ops</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>11</td>
        <td><strong>Commercial Transit Terms</strong></td>
        <td>Approved policy for damaged shipments, unboxing video requirement, and transit insurance claim procedure.</td>
        <td>Legal Policy Doc</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Legal Counsel</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>12</td>
        <td><strong>B2B Wholesale Matrix</strong></td>
        <td>Defined MOQ thresholds (5–19 units vs 20+ units), dealer margins, and credit terms for verified GSTIN holders.</td>
        <td>XLSX Matrix</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Commercial Head</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>13</td>
        <td><strong>Customer Support Desk</strong></td>
        <td>Official WhatsApp Business number, toll-free helpline, support email, and operational business hours.</td>
        <td>Plain Text Confirm</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Support Head</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>14</td>
        <td><strong>Warehouse Pickup Depots</strong></td>
        <td>Physical dispatch addresses, state GST registrations, contact managers, and daily cut-off hours for transport pickup.</td>
        <td>Address Master / XLSX</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Warehouse Ops</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td>15</td>
        <td><strong>Single Point of Contact</strong></td>
        <td>Nominated client project manager with decision-making authority on content, pricing, and milestone sign-offs.</td>
        <td>Contact Card &amp; Role</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Executive Board</td>
        <td>Before Design</td>
        <td>Requested</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== PAGE 2: SECTIONS A & B ==================== -->
  <div class="page-break"></div>

  <h2>Section A: Business and Brand Information <span class="section-code">SEC-A</span></h2>
  <p>Statutory business identity information required for Consumer Protection (E-Commerce) Rules and GST compliance.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 105px;">Item</th>
        <th>What to Provide / Confirm</th>
        <th style="width: 95px;">Preferred Format</th>
        <th style="width: 110px;">Why Needed</th>
        <th style="width: 48px;">Priority</th>
        <th style="width: 50px;">Owner</th>
        <th style="width: 60px;">Needed By</th>
        <th style="width: 65px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Official Entity Name</strong></td>
        <td>Full legal name as registered on GST portal (e.g. <em>Arveer Impex Pvt. Ltd.</em>).</td>
        <td>Govt Certificate / PDF</td>
        <td>Invoicing, payment KYC, statutory compliance.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Design</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Public Brand Name</strong></td>
        <td>Approved spelling: <strong>AGROVÉ</strong>, <strong>AGROVEER</strong>, or <strong>ARVEER</strong>.</td>
        <td>Written Confirmation</td>
        <td>Platform branding, domain selection, logos.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Design</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Company Introduction</strong></td>
        <td>Founding background, factory infrastructure, mission, and agricultural vision.</td>
        <td>Word Doc (300–600w)</td>
        <td>About page, dealer onboarding brochures.</td>
        <td><span class="badge badge-medium">Medium</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Under Review</td>
      </tr>
      <tr>
        <td><strong>Key Differentiators</strong></td>
        <td>Unique engineering advantages (e.g. 100% copper winding, laser serial).</td>
        <td>Bullet Points</td>
        <td>Homepage hero copy, trust badges, product USP.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Design</td>
        <td>Under Review</td>
      </tr>
      <tr>
        <td><strong>Registered Address</strong></td>
        <td>Principal registered business office with PIN code and official telephone.</td>
        <td>GST Registration Doc</td>
        <td>Footer legal disclosure, tax invoices.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Design</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Official Channels</strong></td>
        <td>WhatsApp Business number, customer care email, toll-free helpline, operating hours.</td>
        <td>Text Details</td>
        <td>Support modals, invoice contacts, navbar links.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Decision Maker (SPOC)</strong></td>
        <td>Name, direct phone, and email of authorized decision maker.</td>
        <td>Contact Card</td>
        <td>Milestone approvals, change requests, sprint signs.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Design</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Target Markets</strong></td>
        <td>Priority states (Rajasthan, Punjab, Maharashtra, MP, Gujarat) &amp; farmer demographics.</td>
        <td>List of States / Crops</td>
        <td>Localization engine, regional font presets.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Design</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Vector Brand Assets</strong></td>
        <td>Official vector logo files (SVG, AI, EPS) for AGROVEER and SAWING.</td>
        <td>SVG / AI / EPS</td>
        <td>Navbar, favicon, PDF invoices, watermark.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Design</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Brand Color Palette</strong></td>
        <td>Hex codes for primary, secondary, and accent colors. (Using #102C22 &amp; #A6C96A).</td>
        <td>Hex / Style Guide</td>
        <td>Tailwind CSS theme tokens, UI styling.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Joint</td>
        <td>Before Design</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Social Profiles</strong></td>
        <td>Official YouTube channel, Instagram, Facebook, and LinkedIn links.</td>
        <td>Public URLs</td>
        <td>Footer links, machinery demonstration embeds.</td>
        <td><span class="badge badge-optional">Optional</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Not Requested</td>
      </tr>
    </tbody>
  </table>

  <h2>Section B: Product Catalogue and Product Data <span class="section-code">SEC-B</span></h2>
  <p>Every active product SKU requires full technical parameters, tax categorization, and packaging metrics for automated calculation.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 105px;">Item</th>
        <th>What to Provide / Confirm</th>
        <th style="width: 95px;">Preferred Format</th>
        <th style="width: 110px;">Why Needed</th>
        <th style="width: 48px;">Priority</th>
        <th style="width: 50px;">Owner</th>
        <th style="width: 60px;">Needed By</th>
        <th style="width: 65px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Master Product Sheet</strong></td>
        <td>Structured spreadsheet of all active machinery SKUs and spare components.</td>
        <td>XLSX / Google Sheets</td>
        <td>Neon PostgreSQL database catalog seeding.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>SKU Code Structure</strong></td>
        <td>Systematic SKU naming standard (e.g. <span class="code-span">AGR-ENG-170F-75HP</span>).</td>
        <td>Alphanumeric Strings</td>
        <td>Warehouse management, inventory tracking.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Category Taxonomy</strong></td>
        <td>Classification: Engines, Water Pumps, Brush Cutters, Tillers, Spares.</td>
        <td>Taxonomy Hierarchy</td>
        <td>Category navigation, filter sidebar, breadcrumbs.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Joint</td>
        <td>Before Design</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Technical Specs</strong></td>
        <td>Displacement (cc), Power (HP), RPM, Fuel Type, Tank Size, Starting System.</td>
        <td>Structured Columns</td>
        <td>Product specification table, comparator cards.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>HSN Code &amp; GST Slab</strong></td>
        <td>8-digit HSN code (e.g. 84079000) and applicable GST rate (12% or 18%).</td>
        <td>Numeric Data</td>
        <td>Mandatory GST tax calculations, e-Way bills.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Pricing Architecture</strong></td>
        <td>Printed MRP, Net Retail Selling Price, Tier 1 Wholesale, Tier 2 Wholesale.</td>
        <td>Currency Columns</td>
        <td>Cart calculations, B2B dealer tier discounting.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Dead &amp; Vol. Weight</strong></td>
        <td>Dead gross weight in kg and box dimensions (L x W x H cm).</td>
        <td>Decimal &amp; Dimensions</td>
        <td>Freight calculator, transporter lorry billing.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>In-The-Box Contents</strong></td>
        <td>Exhaustive list of included attachments, spanners, toolkits, manuals.</td>
        <td>Bullet List</td>
        <td>Buyer expectations, unboxing dispute mitigation.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Warranty Duration</strong></td>
        <td>Warranty months (e.g. 12 mo.) bound to laser serial number.</td>
        <td>Number of Months</td>
        <td>Automated warranty certificate generation.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>PDF User Manuals</strong></td>
        <td>Downloadable operator manuals and exploded parts schematics.</td>
        <td>Vector PDF (&lt;10MB)</td>
        <td>Customer portal downloads, self-service repair.</td>
        <td><span class="badge badge-medium">Medium</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== PAGE 3: SECTIONS C & D ==================== -->
  <div class="page-break"></div>

  <h2>Section C: Photography, Video and Creative Assets <span class="section-code">SEC-C</span></h2>
  <p>Clean, high-resolution multimedia assets establish the platform's luxury industrial aesthetic and power the 3D Station.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 105px;">Item</th>
        <th>What to Provide / Confirm</th>
        <th style="width: 95px;">Preferred Format</th>
        <th style="width: 110px;">Why Needed</th>
        <th style="width: 48px;">Priority</th>
        <th style="width: 50px;">Owner</th>
        <th style="width: 60px;">Needed By</th>
        <th style="width: 65px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Hero Studio Photos</strong></td>
        <td>Front 45° angle, isolated on pure white or transparent background.</td>
        <td>PNG / WebP (&gt;2400px)</td>
        <td>Primary catalog card and PDP hero view.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Design</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Component Close-ups</strong></td>
        <td>Carburetor, recoil starter, PTO shaft, muffler, fuel cap details.</td>
        <td>JPG / WebP (&gt;2000px)</td>
        <td>PDP zoom feature, technical inspection gallery.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Laser Serial Photos</strong></td>
        <td>High-res photo of laser-etched serial plate on engine crankcase.</td>
        <td>JPG (&gt;1500px)</td>
        <td>Customer education for warranty registration.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Packaging Photos</strong></td>
        <td>Unboxed carton packaging showing shock-absorbent foam and tools.</td>
        <td>JPG / WebP (&gt;2000px)</td>
        <td>Shows transport-safe packaging to reduce returns.</td>
        <td><span class="badge badge-medium">Medium</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>In-Use Action Photos</strong></td>
        <td>Farm, field, orchard, and crop weeding action photography.</td>
        <td>High-Res JPG</td>
        <td>Homepage lifestyle banners, category headers.</td>
        <td><span class="badge badge-medium">Medium</span></td>
        <td>Client</td>
        <td>Before Design</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Demonstration Videos</strong></td>
        <td>Engine starting procedure, brush cutter assembly, tiller maintenance.</td>
        <td>MP4 (1080p) / YouTube</td>
        <td>PDP video carousel, buyer confidence building.</td>
        <td><span class="badge badge-medium">Medium</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>3D CAD / GLB Models</strong></td>
        <td>Optimized binary GLTF (.glb) files of flagship machinery (&lt;8MB, &lt;85k polys).</td>
        <td>Binary GLTF (.glb)</td>
        <td>Powers the 3D Interactive Inspection Station.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Leadership Portraits</strong></td>
        <td>High-resolution portraits of founders/directors with approved bios.</td>
        <td>Studio JPG</td>
        <td>About Us corporate governance section.</td>
        <td><span class="badge badge-optional">Optional</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Customer Case Studies</strong></td>
        <td>Farmer testimonials, crop yield improvement stats, dealer quotes.</td>
        <td>Text &amp; Signed Consent</td>
        <td>Trust building, commercial conversion uplift.</td>
        <td><span class="badge badge-optional">Optional</span></td>
        <td>Client</td>
        <td>Post-Launch</td>
        <td>Not Requested</td>
      </tr>
      <tr>
        <td><strong>Asset Rights Sign-off</strong></td>
        <td>Written certification that all provided imagery is owned/licensed.</td>
        <td>Signed Release Doc</td>
        <td>Indemnification against copyright infringement.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
    </tbody>
  </table>

  <h2>Section D: Website Pages and Content Architecture <span class="section-code">SEC-D</span></h2>
  <p>Defines the required platform pages, content ownership, and approval workflows.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 105px;">Item</th>
        <th>What to Provide / Confirm</th>
        <th style="width: 95px;">Preferred Format</th>
        <th style="width: 110px;">Why Needed</th>
        <th style="width: 48px;">Priority</th>
        <th style="width: 50px;">Owner</th>
        <th style="width: 60px;">Needed By</th>
        <th style="width: 65px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Homepage Structure</strong></td>
        <td>Hero announcement copy, featured machinery slots, dealer CTA banner.</td>
        <td>Wireframe / Copy Doc</td>
        <td>Primary storefront landing experience.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Joint</td>
        <td>Before Design</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Machinery Catalog</strong></td>
        <td>Category taxonomy, sorting criteria (Price, Power, HP), filter facets.</td>
        <td>UI Spec</td>
        <td>Catalog exploration and search discovery.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Developer</td>
        <td>Before Dev</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Product Detail (PDP)</strong></td>
        <td>Layout with specs, warranty badge, freight estimator, download tabs.</td>
        <td>UI Component Spec</td>
        <td>Core decision point for commercial purchases.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Developer</td>
        <td>Before Dev</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Spares Finder</strong></td>
        <td>Dedicated spare parts portal filtered by base machine model.</td>
        <td>Model Compatibility List</td>
        <td>High-margin recurring revenue stream.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Joint</td>
        <td>Before Dev</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>3D Station Page</strong></td>
        <td>Full-screen interactive 3D WebGL inspection environment.</td>
        <td>3D Canvas Interface</td>
        <td>Flagship technological differentiator.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Developer</td>
        <td>Before Dev</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Dealer Portal Desk</strong></td>
        <td>B2B wholesale application form, bulk pricing calculator, credit terms.</td>
        <td>Form Fields &amp; Terms</td>
        <td>Institutional dealer acquisition channel.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Joint</td>
        <td>Before Dev</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Buyer Account Portal</strong></td>
        <td>Profile setup, email routing, live order tracking, invoice downloads.</td>
        <td>Account Dashboard</td>
        <td>Customer self-service, order visibility.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Developer</td>
        <td>Before Dev</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Multi-Stage Checkout</strong></td>
        <td>Address entry, GSTIN input, two-stage advance booking, Razorpay.</td>
        <td>Checkout Funnel</td>
        <td>Monetization and revenue collection engine.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Developer</td>
        <td>Before Integr.</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Order Success &amp; Bilty</strong></td>
        <td>Confirmation screen with live Lorry Receipt (Bilty) tracking link.</td>
        <td>Tracking View</td>
        <td>Buyer reassurance, delivery transparency.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Developer</td>
        <td>Before Integr.</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Admin Dashboard</strong></td>
        <td>Internal portal for order dispatch, serial binding, and stock edits.</td>
        <td>Admin Interface</td>
        <td>Back-office warehouse and order management.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Developer</td>
        <td>Before Launch</td>
        <td>Approved</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== PAGE 4: SECTIONS E & F ==================== -->
  <div class="page-break"></div>

  <h2>Section E: E-Commerce and Order Workflow <span class="section-code">SEC-E</span></h2>
  <p>Defines commercial order lifecycles, payment models, serial bindings, and returns.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 105px;">Item</th>
        <th>What to Provide / Confirm</th>
        <th style="width: 95px;">Preferred Format</th>
        <th style="width: 110px;">Why Needed</th>
        <th style="width: 48px;">Priority</th>
        <th style="width: 50px;">Owner</th>
        <th style="width: 60px;">Needed By</th>
        <th style="width: 65px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Authentication Model</strong></td>
        <td>Confirm mandatory mobile OTP vs. optional guest checkout for spares.</td>
        <td>Executive Decision</td>
        <td>Prevents spam consignments and fake bookings.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Two-Stage Booking</strong></td>
        <td>Confirm 20% advance online deposit + 80% balance before transport dispatch.</td>
        <td>Business Policy</td>
        <td>Improves conversion on high-value machinery (&gt;₹30k).</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>B2B Wholesale Rules</strong></td>
        <td>Automatic wholesale pricing unlock upon verified GSTIN entry at checkout.</td>
        <td>Business Policy</td>
        <td>Automates bulk dealer transactions without manual sales intervention.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Laser Serial Allocation</strong></td>
        <td>Pre-dispatch barcode scanning to bind engine serial directly to GST invoice.</td>
        <td>Warehouse Protocol</td>
        <td>Warranty tracking, counterfeit prevention.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Joint</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Order Status Cycle</strong></td>
        <td>Booked &rarr; QC &amp; Laser Serial &rarr; Transporter Dispatch &rarr; Godown Delivered.</td>
        <td>Workflow Diagram</td>
        <td>Drives buyer notification SMS, email, and live status.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Developer</td>
        <td>Before Dev</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Cancellation Terms</strong></td>
        <td>Permitted before warehouse packing; non-cancellable once handed to road carrier.</td>
        <td>Legal Policy Doc</td>
        <td>Mitigates carrier return freight loss (RTO).</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Fueled Engine Policy</strong></td>
        <td>Strictly non-returnable once petrol/oil has been added to crankcase.</td>
        <td>Policy Clause</td>
        <td>Safety regulations, hazardous goods transport laws.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>COD Eligibility</strong></td>
        <td>Restricted to small spare parts (&lt;₹2,500); zero COD on heavy machinery.</td>
        <td>Executive Decision</td>
        <td>Eliminates high-cost heavy machinery courier returns.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
    </tbody>
  </table>

  <h2>Section F: Payments, Shipping and Serviceability <span class="section-code">SEC-F</span></h2>
  <p>Heavy machinery requires specialized commercial road logistics (Lorry Bilty) distinct from small courier parcels.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 105px;">Item</th>
        <th>What to Provide / Confirm</th>
        <th style="width: 95px;">Preferred Format</th>
        <th style="width: 110px;">Why Needed</th>
        <th style="width: 48px;">Priority</th>
        <th style="width: 50px;">Owner</th>
        <th style="width: 60px;">Needed By</th>
        <th style="width: 65px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Razorpay Live Credentials</strong></td>
        <td>Production Key ID and Key Secret with active webhook subscriptions.</td>
        <td>Dashboard Invite</td>
        <td>Enables live credit card, UPI, and net banking payments.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Bank Settlement Account</strong></td>
        <td>Verified current account details linked to Razorpay for daily T+2 payouts.</td>
        <td>Bank Verification</td>
        <td>Fund settlement into Arveer Impex corporate account.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Virtual Bank Accounts</strong></td>
        <td>Razorpay Smart Collect / Virtual Account setup for NEFT/RTGS dealer transfers.</td>
        <td>API Feature Flag</td>
        <td>Automated reconciliation of wholesale bank transfers.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Road Freight Carriers</strong></td>
        <td>Master list of contracted transporters (V-Trans, TCI Freight, Safexpress).</td>
        <td>Transporter List</td>
        <td>Populates checkout transporter dropdown and tracking links.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Godown Delivery Terms</strong></td>
        <td>Policy explaining buyer must collect consignment from city transport godown.</td>
        <td>Policy Text</td>
        <td>Prevents buyer expectation of door delivery for 50kg engines.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Freight Cost Model</strong></td>
        <td>Confirm subsidized flat rate (e.g. ₹499/engine) vs. dynamic weight/zone billing.</td>
        <td>Rate Matrix / XLSX</td>
        <td>Checkout shipping calculation engine.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Parcel Courier (Shiprocket)</strong></td>
        <td>Shiprocket seller account credentials for small spare parts (&lt;5kg).</td>
        <td>API User Access</td>
        <td>Automated airway bill (AWB) generation for spares.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Warehouse Pickup Depots</strong></td>
        <td>Dispatch godown addresses, contact supervisors, and daily cut-off hours.</td>
        <td>Address Master</td>
        <td>Origin address for e-Way bills and courier pickups.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Delivery SLA by Zone</strong></td>
        <td>Expected delivery days: North (2–3d), West (3–4d), South (4–6d), East (5–7d).</td>
        <td>SLA Schedule</td>
        <td>Real-time estimated delivery date on PDP and cart.</td>
        <td><span class="badge badge-medium">Medium</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Damage Protocol</strong></td>
        <td>Transit insurance claim process, mandatory 48-hour unboxing video rule.</td>
        <td>SOP Document</td>
        <td>Mitigates fraudulent transit damage claims.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== PAGE 5: SECTIONS G, H, I ==================== -->
  <div class="page-break"></div>

  <h2>Section G: Legal, Compliance and Trust Materials <span class="section-code">SEC-G</span></h2>
  <p>Statutory legal disclosures and tax frameworks required by Indian e-commerce legislation.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 105px;">Item</th>
        <th>What to Provide / Confirm</th>
        <th style="width: 95px;">Preferred Format</th>
        <th style="width: 110px;">Why Needed</th>
        <th style="width: 48px;">Priority</th>
        <th style="width: 50px;">Owner</th>
        <th style="width: 60px;">Needed By</th>
        <th style="width: 65px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>GSTIN Certificate</strong></td>
        <td>Official GST registration certificate showing Principal Place of Business.</td>
        <td>Govt PDF</td>
        <td>Required for payment gateway KYC and tax invoicing.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Design</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>GST Invoice Series</strong></td>
        <td>Sequential invoice prefix for online commerce (e.g. <span class="code-span">AGR/25-26/0001</span>).</td>
        <td>Alphanumeric Format</td>
        <td>Automated sequential GST-compliant PDF invoices.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Digital Invoice Stamp</strong></td>
        <td>Authorized signatory digital image / DSC stamp for PDF invoices.</td>
        <td>Transparent PNG</td>
        <td>Legal validity of automated PDF commercial invoices.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>e-Way Bill API</strong></td>
        <td>NIC e-Way Bill portal API credentials for consignments exceeding ₹50,000.</td>
        <td>Govt API Keys</td>
        <td>Automated e-Way bill generation during dispatch.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Commercial Terms</strong></td>
        <td>Purchase agreement, machinery liability disclaimer, court jurisdiction (Jaipur).</td>
        <td>Legal Document</td>
        <td>Protects company against agricultural crop failure claims.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Return &amp; Refund Policy</strong></td>
        <td>Defective replacement within 7 days; strict exclusions for fueled machinery.</td>
        <td>Legal Document</td>
        <td>Consumer Protection compliance, dispute defense.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Privacy Policy</strong></td>
        <td>Data protection, storage, and processing disclosure under DPDP Act 2023.</td>
        <td>Legal Document</td>
        <td>Mandatory statutory disclosure for user data collection.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Grievance Officer</strong></td>
        <td>Name, official designation, email, and phone of Grievance Redressal Officer.</td>
        <td>Plain Text Details</td>
        <td>Mandatory under Consumer Protection (E-Commerce) Rules.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
    </tbody>
  </table>

  <h2>Section H: SEO, Localization and Marketing <span class="section-code">SEC-H</span></h2>
  <p>Drives high-intent agricultural traffic and enables vernacular localization across regional farming belts.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 105px;">Item</th>
        <th>What to Provide / Confirm</th>
        <th style="width: 95px;">Preferred Format</th>
        <th style="width: 110px;">Why Needed</th>
        <th style="width: 48px;">Priority</th>
        <th style="width: 50px;">Owner</th>
        <th style="width: 60px;">Needed By</th>
        <th style="width: 65px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Agricultural Keywords</strong></td>
        <td>Target search queries (e.g. <em>"7.5 HP petrol engine price", "brush cutter wholesale"</em>).</td>
        <td>Keyword List / XLSX</td>
        <td>Meta titles, descriptions, and category copy optimization.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Joint</td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Google Search Console</strong></td>
        <td>Ownership verification on Google Search Console for production domain.</td>
        <td>Console Access</td>
        <td>Automated sitemap XML submission, Google indexing.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Developer</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Google Analytics 4 (GA4)</strong></td>
        <td>Measurement ID (<span class="code-span">G-XXXXXXXXXX</span>) configured for e-commerce purchase tracking.</td>
        <td>Measurement ID</td>
        <td>Traffic attribution, checkout funnel drop-off analytics.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Joint</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Regional Terminology</strong></td>
        <td>Sign-off on regional machinery terms (Hindi, Punjabi, Bengali, Marathi, etc.).</td>
        <td>Glossary Sign-off</td>
        <td>Accurate technical vernacular copy without awkward translations.</td>
        <td><span class="badge badge-medium">Medium</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Under Review</td>
      </tr>
      <tr>
        <td><strong>Meta Pixel ID</strong></td>
        <td>Pixel ID (<span class="code-span">1234567890</span>) for Facebook/Instagram retargeting ads.</td>
        <td>Pixel ID String</td>
        <td>Retargeting farmers who viewed specific machinery.</td>
        <td><span class="badge badge-optional">Optional</span></td>
        <td>Client</td>
        <td>Post-Launch</td>
        <td>Not Requested</td>
      </tr>
      <tr>
        <td><strong>Social Sharing Banners</strong></td>
        <td>1200 x 630px OpenGraph sharing card featuring AGROVEER machinery.</td>
        <td>PNG / JPG (1200x630)</td>
        <td>Rich preview cards when links are shared on WhatsApp.</td>
        <td><span class="badge badge-medium">Medium</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
    </tbody>
  </table>

  <h2>Section I: Admin Operations and Business Roles <span class="section-code">SEC-I</span></h2>
  <p>Defines staff operational roles and notification routing within the custom AGROVEER Admin Dashboard.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 105px;">Item</th>
        <th>What to Provide / Confirm</th>
        <th style="width: 95px;">Preferred Format</th>
        <th style="width: 110px;">Why Needed</th>
        <th style="width: 48px;">Priority</th>
        <th style="width: 50px;">Owner</th>
        <th style="width: 60px;">Needed By</th>
        <th style="width: 65px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Super Administrator</strong></td>
        <td>Managing Director / CEO email for full unrestricted platform administration.</td>
        <td>Official Email</td>
        <td>Financial reporting, user management, pricing overrides.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Order &amp; Logistics Manager</strong></td>
        <td>Warehouse Lead email for serial assignment, Bilty entry, and dispatch.</td>
        <td>Official Email</td>
        <td>Daily order fulfillment and packing slip generation.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Catalog Manager</strong></td>
        <td>Inventory Lead email for adding products, updating stock, and price changes.</td>
        <td>Official Email</td>
        <td>Catalog maintenance, stock adjustments.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Support Desk Agent</strong></td>
        <td>Customer Care email for managing warranty claims and dealer enquiries.</td>
        <td>Official Email</td>
        <td>Customer query resolution, dealer onboarding.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Low-Stock Alerts</strong></td>
        <td>Email list to receive automated alerts when inventory falls below 5 units.</td>
        <td>Email Distribution List</td>
        <td>Prevents stockouts on high-demand machinery.</td>
        <td><span class="badge badge-medium">Medium</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Barcode Hardware SOP</strong></td>
        <td>Confirmation of handheld 2D USB/Bluetooth barcode scanner model.</td>
        <td>Hardware Spec</td>
        <td>Rapid warehouse packing and serial number binding.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Client</td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== PAGE 6: SECTIONS J & K ==================== -->
  <div class="page-break"></div>

  <h2>Section J: Technical Access — Developer Only <span class="section-code">SEC-J</span></h2>
  <div class="callout callout-warning">
    <strong>Strict Security Protocol — Zero Password Sharing:</strong> In accordance with cybersecurity best practices, never transmit raw root passwords, private keys, or recovery codes through email or chat. All access must be provisioned via <strong>Scoped Collaborator Invitations</strong> with least-privilege administrative access.
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 105px;">Service</th>
        <th>Current Provisioning</th>
        <th>Required Client Delegation Action</th>
        <th style="width: 110px;">Security Method</th>
        <th style="width: 48px;">Priority</th>
        <th style="width: 60px;">Needed By</th>
        <th style="width: 65px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Domain Registrar (DNS)</strong></td>
        <td>Staging domain</td>
        <td>Invite developer to Cloudflare / GoDaddy DNS to configure A and CNAME records.</td>
        <td>DNS Delegate / Team Invite</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Before Launch</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Neon PostgreSQL DB</strong></td>
        <td>Dev DB: <span class="code-span">green-credit-12994933</span></td>
        <td>Client creates primary Neon organization and invites developer as Project Admin.</td>
        <td>Neon Organization Invite</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Before Dev</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Vercel Cloud Hosting</strong></td>
        <td>Deployment Pipeline Ready</td>
        <td>Client provisions Vercel Pro Team and connects authorized GitHub repository.</td>
        <td>Vercel Team Member</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Razorpay Gateway</strong></td>
        <td>Test Sandbox Active</td>
        <td>Generate Live Key ID and Secret; add developer email as 'Operations / Developer'.</td>
        <td>Scoped Dashboard Role</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Resend Email API</strong></td>
        <td>Dev API Key</td>
        <td>Verify domain DNS records (SPF, DKIM, DMARC) on Resend for production sender.</td>
        <td>DNS TXT Records</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Firebase Auth/Storage</strong></td>
        <td>Development Instance</td>
        <td>Client provisions production Firebase project and invites developer as Editor.</td>
        <td>GCP IAM Invite</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Shiprocket API</strong></td>
        <td>Sandbox Ready</td>
        <td>Create dedicated API user credentials under Shiprocket Company Settings.</td>
        <td>API User Token</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Before Integr.</td>
        <td>Requested</td>
      </tr>
    </tbody>
  </table>

  <h2>Section K: Approvals, Timelines and Governance <span class="section-code">SEC-K</span></h2>
  <p>Defines the formal approval workflow, feedback service level agreements, and sign-off criteria.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 105px;">Milestone</th>
        <th>Scope of Deliverable</th>
        <th style="width: 95px;">Authorized Approver</th>
        <th style="width: 110px;">Approval Criteria</th>
        <th style="width: 48px;">Priority</th>
        <th style="width: 50px;">Owner</th>
        <th style="width: 60px;">Needed By</th>
        <th style="width: 65px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Design &amp; Layout Freeze</strong></td>
        <td>Homepage, catalog, PDP, 3D station, and mobile responsive designs.</td>
        <td>Managing Director</td>
        <td>Figma visual review and brand alignment sign-off.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>End Sprint 1</td>
        <td>Approved</td>
      </tr>
      <tr>
        <td><strong>Catalog Seeding Sign-off</strong></td>
        <td>Verification of all SKU prices, HSN codes, specifications, and images.</td>
        <td>Inventory Head</td>
        <td>100% accuracy of product data against physical inventory.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>End Sprint 2</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Payment &amp; Tax Audit</strong></td>
        <td>Test orders verifying Razorpay settlement, CGST/SGST/IGST, and PDF invoices.</td>
        <td>Chief Accountant</td>
        <td>Zero discrepancies on tax calculations and bank deposits.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>End Sprint 3</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>UAT Acceptance</strong></td>
        <td>End-to-end booking of test consignments, serial scan, and Bilty release.</td>
        <td>Operations Lead</td>
        <td>Successful fulfillment test without software exceptions.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>End Sprint 4</td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><strong>Production Go-Live</strong></td>
        <td>DNS cutover to live domain, production SSL activation, ad campaigns live.</td>
        <td>Managing Director</td>
        <td>Final commercial launch authorization.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Client</td>
        <td>Launch Day</td>
        <td>Requested</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== PAGE 7: QUESTIONNAIRE & RISKS ==================== -->
  <div class="page-break"></div>

  <h2>7. Strategic Business Decision Questionnaire <span class="section-code">SEC-DEC</span></h2>
  <p class="lead-text">
    The client executive committee must select and lock in one option for each of the following 8 fundamental business decisions.
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 20px;">#</th>
        <th style="width: 140px;">Strategic Decision</th>
        <th>Option A (Recommended Engineering Standard)</th>
        <th>Option B (Alternative Business Model)</th>
        <th style="width: 95px;">Client Decision</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Q1</td>
        <td><strong>Buyer Authentication</strong></td>
        <td><strong>Mandatory Mobile OTP:</strong> Requires phone verification before booking to eliminate fake machinery consignments.</td>
        <td><strong>Open Guest Checkout:</strong> Faster conversion, but risks high rates of fake bookings and wasted freight.</td>
        <td>[ ] Option A<br/>[ ] Option B</td>
      </tr>
      <tr>
        <td>Q2</td>
        <td><strong>High-Value Machinery Booking</strong></td>
        <td><strong>Two-Stage Booking:</strong> 20% online advance deposit; 80% balance collected via Bank RTGS before godown dispatch.</td>
        <td><strong>100% Full Advance Only:</strong> Zero financial risk, but may reduce checkout conversion on expensive tillers.</td>
        <td>[ ] Option A<br/>[ ] Option B</td>
      </tr>
      <tr>
        <td>Q3</td>
        <td><strong>Cash on Delivery (COD) Policy</strong></td>
        <td><strong>Restricted COD:</strong> Available only for small spare parts (&lt;₹2,500) where courier return costs (RTO) are low.</td>
        <td><strong>Strictly Zero COD:</strong> 100% prepaid or advance booking only across all products.</td>
        <td>[ ] Option A<br/>[ ] Option B</td>
      </tr>
      <tr>
        <td>Q4</td>
        <td><strong>Heavy Freight Pricing Model</strong></td>
        <td><strong>Flat Subsidized Freight:</strong> ₹499/engine; remaining freight absorbed to maintain nationwide price parity.</td>
        <td><strong>Actual Freight Billing:</strong> Dynamic distance &amp; weight based freight calculated at checkout.</td>
        <td>[ ] Option A<br/>[ ] Option B</td>
      </tr>
      <tr>
        <td>Q5</td>
        <td><strong>B2B Wholesale Eligibility</strong></td>
        <td><strong>Instant API GSTIN Verification:</strong> Valid GSTIN holders automatically unlock wholesale tiers upon entry.</td>
        <td><strong>Manual Dealer Vetting:</strong> Accounts team reviews and manually approves dealer accounts offline.</td>
        <td>[ ] Option A<br/>[ ] Option B</td>
      </tr>
      <tr>
        <td>Q6</td>
        <td><strong>Transit Loss &amp; Insurance</strong></td>
        <td><strong>Merchant Insured Consignments:</strong> Arveer Impex covers transit insurance; buyer gets free replacement if damaged.</td>
        <td><strong>Ex-Factory Terms:</strong> Buyer pays transit insurance; claims filed directly by buyer against road carrier.</td>
        <td>[ ] Option A<br/>[ ] Option B</td>
      </tr>
      <tr>
        <td>Q7</td>
        <td><strong>Laser Serial Allocation</strong></td>
        <td><strong>Pre-Dispatch Serial Scan:</strong> Serial barcode scanned during packing; printed directly on the automated GST invoice.</td>
        <td><strong>Manual Post-Dispatch Log:</strong> Serial logged into offline register after shipment leaves warehouse.</td>
        <td>[ ] Option A<br/>[ ] Option B</td>
      </tr>
      <tr>
        <td>Q8</td>
        <td><strong>Regional Vernacular Engine</strong></td>
        <td><strong>Dynamic Auto-Switch:</strong> Platform auto-detects user GPS state and loads native language and regional font family.</td>
        <td><strong>Manual Language Toggle:</strong> Site defaults to English; user must click language dropdown to switch.</td>
        <td>[ ] Option A<br/>[ ] Option B</td>
      </tr>
    </tbody>
  </table>

  <h2>8. Critical Dependencies, Risk Assessment &amp; Delay Impact <span class="section-code">SEC-RISK</span></h2>
  <p>The table below demonstrates how delays in client deliverables impact dependent engineering work and final launch dates.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 140px;">Missing Deliverable</th>
        <th>Dependent Engineering Work</th>
        <th style="width: 140px;">Launch Timeline Impact</th>
        <th>Mitigation Strategy</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Master Product Spreadsheet</strong></td>
        <td>Database seeding, category navigation, search filters, cart pricing logic.</td>
        <td><strong>2–3 Week Launch Delay.</strong> Storefront cannot be populated or demonstrated.</td>
        <td>Provide top 10 flagship SKUs first to enable initial staging sign-off.</td>
      </tr>
      <tr>
        <td><strong>Razorpay Live Credentials</strong></td>
        <td>Payment gateway integration, webhook handlers, automated invoice triggers.</td>
        <td><strong>1–2 Week Launch Delay.</strong> No live transactions can be processed or verified.</td>
        <td>Complete Razorpay KYC immediately; sandbox mode remains active in interim.</td>
      </tr>
      <tr>
        <td><strong>Heavy Transporter Rate Matrix</strong></td>
        <td>Checkout shipping calculator, delivery hub dropdowns, Bilty generation.</td>
        <td><strong>1 Week Launch Delay.</strong> High risk of incorrect freight billing to buyers.</td>
        <td>Default to flat subsidized freight rates while logistics agreements are finalized.</td>
      </tr>
      <tr>
        <td><strong>Official Terms &amp; Policies</strong></td>
        <td>Footer legal links, payment gateway approval compliance, buyer checkout consent.</td>
        <td><strong>Payment Gateway Rejection.</strong> Razorpay requires live policy links for activation.</td>
        <td>Adopt standard industry legal templates pre-reviewed by corporate counsel.</td>
      </tr>
      <tr>
        <td><strong>3D GLB Machinery Models</strong></td>
        <td>3D Station interactive rendering, exploded parts inspection.</td>
        <td><strong>Feature Postponement.</strong> 3D Station hidden until CAD models are ready.</td>
        <td>Launch Phase 1 with studio photos; deploy 3D Station in Phase 2 release.</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== PAGE 8: ROADMAP & PROTOCOL ==================== -->
  <div class="page-break"></div>

  <h2>9. Phased Implementation Roadmap &amp; RACI Governance <span class="section-code">SEC-ROADMAP</span></h2>
  <p class="lead-text">
    The <strong>RACI Matrix</strong> defines who is <strong>Responsible (R)</strong>, <strong>Accountable (A)</strong>, <strong>Consulted (C)</strong>, and <strong>Informed (I)</strong> across all 5 delivery phases.
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 130px;">Milestone / Phase</th>
        <th>Key Deliverables</th>
        <th style="width: 70px;">Client MD</th>
        <th style="width: 80px;">Client Ops</th>
        <th style="width: 80px;">Dev Lead</th>
        <th style="width: 85px;">Target Window</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Phase 1: Discovery &amp; Core Data</strong></td>
        <td>Entity details, GSTIN, Master Product CSV, Brand vectors, Decision Questionnaire.</td>
        <td>Accountable</td>
        <td>Responsible</td>
        <td>Consulted</td>
        <td>Sprint 1 (Days 1–5)</td>
      </tr>
      <tr>
        <td><strong>Phase 2: Creative &amp; Media</strong></td>
        <td>Studio packaging photos, 3D GLTF models, user manuals, warranty policy.</td>
        <td>Accountable</td>
        <td>Responsible</td>
        <td>Informed</td>
        <td>Sprint 2 (Days 6–10)</td>
      </tr>
      <tr>
        <td><strong>Phase 3: Integrations &amp; Payments</strong></td>
        <td>Razorpay live keys, Resend domain verification, Transporter agreements, Shiprocket.</td>
        <td>Informed</td>
        <td>Accountable</td>
        <td>Responsible</td>
        <td>Sprint 3 (Days 11–16)</td>
      </tr>
      <tr>
        <td><strong>Phase 4: UAT &amp; Security Audit</strong></td>
        <td>End-to-end test orders, serial scanning simulation, invoice audit, mobile testing.</td>
        <td>Accountable</td>
        <td>Responsible</td>
        <td>Responsible</td>
        <td>Sprint 4 (Days 17–20)</td>
      </tr>
      <tr>
        <td><strong>Phase 5: Production Go-Live</strong></td>
        <td>DNS cutover, SSL certification, live transactions, search console sitemaps.</td>
        <td>Accountable</td>
        <td>Informed</td>
        <td>Responsible</td>
        <td>Commercial Launch</td>
      </tr>
    </tbody>
  </table>

  <h2>10. Client Asset Submission Guide &amp; Single Point of Contact (SPOC) Protocol</h2>
  <div class="callout callout-info">
    <strong>Asset Submission Protocol:</strong> To prevent project bottlenecks, client materials should be submitted in <strong>structured batches</strong> via a secure corporate cloud folder (Google Drive / OneDrive) organized into the following directory structure:
    <ul>
      <li><span class="code-span">/01_Legal_and_GST/</span> &mdash; GSTIN Certificate, Incorporation, DSC Stamp, Grievance Officer details.</li>
      <li><span class="code-span">/02_Product_Master/</span> &mdash; Master Catalog CSV/XLSX, User Manual PDFs, Exploded Part Diagrams.</li>
      <li><span class="code-span">/03_Media_Assets/</span> &mdash; Studio Photos (Named by SKU), Video Demos, Vector Logos.</li>
      <li><span class="code-span">/04_3D_Models/</span> &mdash; Optimized binary GLTF (<span class="code-span">.glb</span>) files for 3D Station.</li>
      <li><span class="code-span">/05_Logistics_and_Accounts/</span> &mdash; Transporter rate card, Godown addresses, Bank settlement details.</li>
    </ul>
  </div>

  <h2>11. Optional Client Transmittal Message</h2>
  <div class="card" style="background: #F8FAF9; border-left: 4px solid #24583D; font-size: 7.2pt; color: #2D3748; line-height: 1.45;">
    <em>"Good afternoon, team. As discussed, we have prepared the structured master requirements and resource discovery blueprint for the <strong>AGROVEER &amp; SAWING</strong> platform. Please feel free to share the materials in batches via your shared drive. We can prioritize the essential items first (Batch 1: Top 15 Launch Blockers) and coordinate on anything requiring operational clarification. This ensures the engineering process remains rapid, organized, and strictly compliant with your commercial expectations."</em>
  </div>

  <div class="page-footer">
    <div><strong>AGROVEER™ &amp; SAWING™</strong> — Distributed Exclusively by Arveer Impex</div>
    <div>Confidential • Enterprise Requirements Discovery Specification</div>
    <div>Document Ref: AGR-DISC-2026-V2.0 • Complete 8-Page Master Edition</div>
  </div>

</body>
</html>
"""

html_path = r"c:\Users\Utsab Sinha\Downloads\AGROVÉ\requirements_spec_master.html"
pdf_path = r"c:\Users\Utsab Sinha\Downloads\AGROVEER_Platform_Requirements_Master_Document.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Master HTML written to {html_path}")

# Run Chrome Headless
chrome_cmd = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_path}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

print("Executing Chrome headless print-to-pdf...")
res = subprocess.run(chrome_cmd, capture_output=True, text=True)
print(f"Return code: {res.returncode}")
print(f"Stderr: {res.stderr}")

if os.path.exists(pdf_path):
    size = os.path.getsize(pdf_path)
    print(f"SUCCESS: Master PDF generated at {pdf_path} ({size:,} bytes)")
else:
    print("FAILED to create PDF.")

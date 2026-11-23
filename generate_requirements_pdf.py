# -*- coding: utf-8 -*-
"""
AGROVEER Platform Requirements & Discovery Document Generator (Full Exhaustive Edition)
Produces an authoritative, client-facing PDF covering Sections A through K,
with tables, checkboxes, field dictionaries, decision questionnaires,
developer protocols, and dependency matrices.
"""

import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AGROVEER — Platform Requirements, Resource Discovery &amp; Technical Master Blueprint</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4 portrait;
      margin: 12mm 12mm 12mm 12mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 8pt;
      line-height: 1.4;
      color: #2D3748;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4 {
      color: #102C22;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 5px;
    }

    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 19pt;
      line-height: 1.15;
      color: #102C22;
      letter-spacing: -0.5px;
    }

    h2 {
      font-size: 11pt;
      border-bottom: 2px solid #24583D;
      padding-bottom: 3px;
      margin-top: 12px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    h2 .section-code {
      background: #102C22;
      color: #A6C96A;
      font-size: 7.5pt;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
    }

    h3 {
      font-size: 9.5pt;
      color: #24583D;
      margin-top: 8px;
      margin-bottom: 3px;
    }

    p {
      margin-top: 0;
      margin-bottom: 5px;
      text-align: justify;
    }

    .lead-text {
      font-size: 8.5pt;
      color: #4A5568;
      line-height: 1.45;
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
      padding: 16px 18px;
      border-radius: 7px;
      margin-bottom: 10px;
      border-left: 6px solid #A6C96A;
    }

    .doc-header .brand-title {
      font-family: 'Playfair Display', serif;
      font-size: 19pt;
      font-weight: 700;
      color: #F7F5F0;
      margin: 0;
      letter-spacing: 0.5px;
    }

    .doc-header .brand-title span {
      color: #A6C96A;
    }

    .doc-header .subtitle {
      font-size: 9.5pt;
      font-weight: 600;
      color: #E2E8F0;
      margin-top: 2px;
      margin-bottom: 6px;
    }

    .doc-meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      background: rgba(255, 255, 255, 0.08);
      padding: 6px 10px;
      border-radius: 5px;
      font-size: 7.2pt;
      border: 1px solid rgba(166, 201, 106, 0.2);
    }

    .doc-meta-item strong {
      color: #A6C96A;
      display: block;
      text-transform: uppercase;
      font-size: 6.2pt;
      letter-spacing: 0.5px;
      margin-bottom: 1px;
    }

    /* Badges & Pills */
    .badge {
      display: inline-block;
      padding: 1px 4.5px;
      border-radius: 3px;
      font-size: 6.5pt;
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

    .badge-ready {
      background: #C6F6D5;
      color: #22543D;
      border: 1px solid #9AE6B4;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      font-size: 7.4pt;
    }

    th {
      background-color: #102C22;
      color: #FFFFFF;
      text-align: left;
      padding: 4px 5px;
      font-weight: 600;
      font-size: 7pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border: 1px solid #102C22;
    }

    td {
      padding: 3.8px 5px;
      border: 1px solid #E2E8F0;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background-color: #F8FAF9;
    }

    /* Callout Boxes */
    .callout {
      padding: 6px 10px;
      border-radius: 5px;
      margin-bottom: 7px;
      font-size: 7.5pt;
    }

    .callout-warning {
      background-color: #FFFDF5;
      border-left: 3.5px solid #DD6B20;
      border-right: 1px solid #FEEBC8;
      border-top: 1px solid #FEEBC8;
      border-bottom: 1px solid #FEEBC8;
      color: #7B341E;
    }

    .callout-info {
      background-color: #F0FFF4;
      border-left: 3.5px solid #24583D;
      border-right: 1px solid #C6F6D5;
      border-top: 1px solid #C6F6D5;
      border-bottom: 1px solid #C6F6D5;
      color: #1C4532;
    }

    .callout-danger {
      background-color: #FFF5F5;
      border-left: 3.5px solid #E53E3E;
      border-right: 1px solid #FED7D7;
      border-top: 1px solid #FED7D7;
      border-bottom: 1px solid #FED7D7;
      color: #9B2C2C;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 7px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px;
      margin-bottom: 7px;
    }

    .card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 5px;
      padding: 6px 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }

    .card-title {
      font-size: 8pt;
      font-weight: 700;
      color: #102C22;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .code-span {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.8pt;
      background: #EDF2F7;
      padding: 1px 3px;
      border-radius: 2px;
      color: #2D3748;
    }

    ul, ol {
      margin-top: 2px;
      margin-bottom: 5px;
      padding-left: 14px;
    }

    li {
      margin-bottom: 2px;
    }

    .status-check {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      color: #718096;
    }

    .page-footer {
      border-top: 1px solid #E2E8F0;
      padding-top: 5px;
      margin-top: 10px;
      font-size: 6.8pt;
      color: #718096;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1: COVER & EXECUTIVE SUMMARY ==================== -->
  <div class="doc-header">
    <div class="brand-title">AGROVÉ<span>ER</span> &amp; SA<span>W</span>KING</div>
    <div class="subtitle">Platform Requirements, Asset Discovery &amp; Engineering Master Blueprint</div>
    <div class="doc-meta-grid">
      <div class="doc-meta-item">
        <strong>Document Code</strong>
        AGR-REQ-2026-V1.0
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
        <strong>Target Stack</strong>
        Next.js 14 • Neon DB • Razorpay
      </div>
    </div>
  </div>

  <div class="callout callout-info">
    <strong>Executive Purpose &amp; Quality Mandate:</strong> This document specifies the comprehensive inventory of business information, product catalogs, technical credentials, media assets, logistics agreements, and legal documentation required from <strong>Arveer Impex (Agroveer)</strong> for production launch. In strict compliance with client guidelines: <em>Zero placeholder or fabricated demo data will be accepted into the production environment.</em>
  </div>

  <h2>1. Platform Architecture &amp; Hybrid E-Commerce Scope <span class="section-code">SEC-01</span></h2>
  <p class="lead-text">
    <strong>AGROVEER</strong> is engineered as a next-generation agricultural machinery and equipment commerce platform. It integrates a consumer-facing retail storefront (Farmer Direct) with a specialized <strong>B2B Commercial Dealer Portal</strong>. The system encompasses interactive 3D WebGL machinery exploration, real-time GPS state detection with automatic vernacular language and font switching, Razorpay payment processing, and commercial road transport Lorry Receipt (Bilty) consignment tracking.
  </p>

  <div class="grid-3">
    <div class="card">
      <div class="card-title">Commercial Machinery Portal</div>
      <p style="font-size: 7.2pt; color: #4A5568;">Direct sales &amp; wholesale orders for petrol engines (170F 7.5HP), brush cutters, high-flow water pumps, tillers, and chainsaws with laser-serial tracking.</p>
    </div>
    <div class="card">
      <div class="card-title">3D Interactive Station</div>
      <p style="font-size: 7.2pt; color: #4A5568;">Three.js &amp; WebGL exploded parts visualization, 360° inspection, and maintenance guidance for technical buyers and workshops.</p>
    </div>
    <div class="card">
      <div class="card-title">Multilingual &amp; GPS Engine</div>
      <p style="font-size: 7.2pt; color: #4A5568;">Real-time geolocation resolving Indian states &amp; districts with dynamic switching across 8 languages and native regional Google font stacks.</p>
    </div>
  </div>

  <h2>2. "Send These First" — Top 15 Highest Priority Launch Blockers <span class="section-code">SEC-02</span></h2>
  <p>These 15 items constitute the critical path. Missing any of these blocks visual design, payment gateway activation, or order fulfillment.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 22px;">#</th>
        <th style="width: 130px;">Deliverable Item</th>
        <th>What the Client Must Provide</th>
        <th style="width: 75px;">Priority</th>
        <th style="width: 75px;">Owner</th>
        <th style="width: 140px;">Impact of Delay</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>01</td>
        <td><strong>Legal Entity &amp; GSTIN</strong></td>
        <td>Official registered business name, Certificate of Incorporation, GSTIN Certificate, and principal place of business.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Managing Director</td>
        <td>Blocks Razorpay activation, GST tax invoicing, and legal terms.</td>
      </tr>
      <tr>
        <td>02</td>
        <td><strong>Master Product Catalog (CSV)</strong></td>
        <td>Structured spreadsheet of all active SKUs, HSN codes (8407/8432/8433), MRP, dealer price, weight, and GST rates.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Inventory Head</td>
        <td>Blocks database seeding, catalog browsing, and cart calculations.</td>
      </tr>
      <tr>
        <td>03</td>
        <td><strong>Razorpay Live Account</strong></td>
        <td>Activated Razorpay business account invite with verified bank settlement account for NEFT/UPI/Card transactions.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Finance / Accounts</td>
        <td>Blocks live payments; platform remains restricted to mock/test modes.</td>
      </tr>
      <tr>
        <td>04</td>
        <td><strong>Brand Vector Logo Files</strong></td>
        <td>Official vector assets (SVG, AI, EPS, transparent PNG &gt;2000px) for AGROVEER and SAWING, plus brand style guide.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Brand Marketing</td>
        <td>Blocks UI finalization, header branding, and automated GST invoices.</td>
      </tr>
      <tr>
        <td>05</td>
        <td><strong>Heavy Freight Transporters</strong></td>
        <td>Confirmed partnerships with road logistics carriers (V-Trans, TCI Freight, Safexpress) and godown delivery hubs.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Logistics Head</td>
        <td>Blocks freight cost calculation and Lorry Receipt (Bilty) dispatch.</td>
      </tr>
      <tr>
        <td>06</td>
        <td><strong>Machinery Warranty Policy</strong></td>
        <td>Official warranty duration (6/12/24 mo.), covered mechanical parts, excluded consumables, and repair protocol.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Technical Director</td>
        <td>Blocks warranty card generation and laser serial registration.</td>
      </tr>
      <tr>
        <td>07</td>
        <td><strong>High-Res Studio Photos</strong></td>
        <td>Clean studio images (white/transparent background, &gt;2400px): hero 45°, controls, PTO shaft, barcode serial, accessories.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Creative Agency</td>
        <td>Products display placeholder art, causing high buyer bounce rate.</td>
      </tr>
      <tr>
        <td>08</td>
        <td><strong>3D Machinery Models (GLB)</strong></td>
        <td>Optimized 3D models (&lt;8MB, &lt;85k polys, PBR textures) for 170F Engine, Brush Cutter, and Water Pump.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>3D CAD Studio</td>
        <td>Blocks the 3D Interactive Inspection Station feature.</td>
      </tr>
      <tr>
        <td>09</td>
        <td><strong>Domain Registrar &amp; DNS</strong></td>
        <td>Access or delegated permissions on domain registrar (Cloudflare, GoDaddy) for production DNS routing.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>IT Administrator</td>
        <td>Blocks SSL issuance, email verification records, and live launch.</td>
      </tr>
      <tr>
        <td>10</td>
        <td><strong>Transactional Email (Resend)</strong></td>
        <td>Dedicated sending subdomain (<span class="code-span">mail.agroveer.com</span>) with SPF, DKIM, and DMARC TXT records configured.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>IT / Operations</td>
        <td>Transactional order confirmations and OTPs go to spam.</td>
      </tr>
      <tr>
        <td>11</td>
        <td><strong>Commercial Transit Terms</strong></td>
        <td>Approved policy for damaged shipments, unboxing video requirement, and transit insurance claim procedure.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Legal Advisor</td>
        <td>Exposes company to customer chargebacks and courier disputes.</td>
      </tr>
      <tr>
        <td>12</td>
        <td><strong>B2B Wholesale Tier Matrix</strong></td>
        <td>Defined MOQ thresholds (5–19 units vs 20+ units), dealer margins, and credit terms for verified GSTIN holders.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Commercial Head</td>
        <td>Inability to automate wholesale pricing and bulk checkout.</td>
      </tr>
      <tr>
        <td>13</td>
        <td><strong>Support Desk Channels</strong></td>
        <td>Official WhatsApp Business number, toll-free helpline, support email, and operational business hours.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Support Head</td>
        <td>Blocks footer, invoice contacts, and WhatsApp transporter buttons.</td>
      </tr>
      <tr>
        <td>14</td>
        <td><strong>Warehouse Pickup Depots</strong></td>
        <td>Physical dispatch addresses, state GST registrations, contact managers, and daily cut-off hours for transport pickup.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Warehouse Ops</td>
        <td>Blocks e-Way Bill generation and origin shipping calculations.</td>
      </tr>
      <tr>
        <td>15</td>
        <td><strong>Single Point of Contact (SPOC)</strong></td>
        <td>Nominated client project manager with decision-making authority on content, pricing, and milestone sign-offs.</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Executive Board</td>
        <td>Conflicting instructions, feedback bottlenecks, and schedule slips.</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== PAGE 2: CODEBASE AUDIT & SECTION A ==================== -->
  <div class="page-break"></div>

  <h2>3. Active Codebase Audit vs. Client Requirements <span class="section-code">SEC-03</span></h2>
  <p class="lead-text">
    The development team has completed a full architectural audit of the active codebase (<span class="code-span">frontend</span> Next.js 14 App Router, <span class="code-span">backend</span> Express/Prisma, Neon PostgreSQL). The table below demonstrates what is already functional versus what awaits client inputs.
  </p>

  <table>
    <thead>
      <tr>
        <th>Platform Component</th>
        <th>Codebase Implementation Status</th>
        <th>Pending Client Input</th>
        <th>Readiness</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Database &amp; Data Models</strong></td>
        <td>Neon PostgreSQL live on AWS Singapore. Full Prisma schema for <span class="code-span">User</span>, <span class="code-span">Profile</span>, <span class="code-span">Product</span>, <span class="code-span">Order</span>, <span class="code-span">OrderItem</span>, <span class="code-span">Review</span>.</td>
        <td>Real product CSV master to replace development seeds with authentic data.</td>
        <td><span class="badge badge-ready">Engine Ready</span></td>
      </tr>
      <tr>
        <td><strong>Authentication &amp; Security</strong></td>
        <td>Dual Firebase Auth and Neon DB sync. Buyer and Dealer role models with email/phone authentication.</td>
        <td>Production Firebase project invitation and domain email sender authorization.</td>
        <td><span class="badge badge-ready">Engine Ready</span></td>
      </tr>
      <tr>
        <td><strong>Multilingual Engine</strong></td>
        <td><span class="code-span">LanguageFontManager</span> with dynamic font injection for Hindi, Punjabi, Bengali, Marathi, Telugu, Gujarati, Tamil, English.</td>
        <td>Approved translation strings for technical terms (or sign-off on AI translation).</td>
        <td><span class="badge badge-ready">Live &amp; Tested</span></td>
      </tr>
      <tr>
        <td><strong>Real-Time GPS Location</strong></td>
        <td>HTML5 Geolocation + Nominatim reverse geocoder resolving State, District, and PIN code. Auto-triggers regional language.</td>
        <td>Confirmation of any state-specific distribution restrictions or logistics zones.</td>
        <td><span class="badge badge-ready">Live &amp; Tested</span></td>
      </tr>
      <tr>
        <td><strong>3D Interactive Station</strong></td>
        <td>WebGL canvas with Three.js orbit controls, lighting rigs, and exploded parts disassembly hooks.</td>
        <td>Optimized binary GLTF (<span class="code-span">.glb</span>) files of client's proprietary machinery.</td>
        <td><span class="badge badge-high">Awaiting 3D Files</span></td>
      </tr>
      <tr>
        <td><strong>Payment &amp; Invoicing</strong></td>
        <td>Razorpay gateway hooks, automated CGST/SGST/IGST tax engine, and PDF commercial invoice generator.</td>
        <td>Live Razorpay Key ID/Secret, registered GSTIN, and digital invoice sign-off.</td>
        <td><span class="badge badge-critical">Awaiting Live Keys</span></td>
      </tr>
      <tr>
        <td><strong>Order &amp; Serial Tracking</strong></td>
        <td><span class="code-span">orderStorage.ts</span> with laser-serial binding and Lorry Receipt (Bilty) consignment tracking.</td>
        <td>Warehouse barcode scanner format and transporter master list.</td>
        <td><span class="badge badge-ready">Engine Ready</span></td>
      </tr>
    </tbody>
  </table>

  <h2>Section A: Business, Corporate &amp; Brand Identity Requirements <span class="section-code">SEC-A</span></h2>
  <p>Statutory business identity information required for Consumer Protection (E-Commerce) Rules and GST compliance.</p>

  <table>
    <thead>
      <tr>
        <th style="width: 22px;"><span class="status-check">[&#10003;]</span></th>
        <th style="width: 130px;">Item</th>
        <th>What to Provide / Confirm</th>
        <th>Format / Specification</th>
        <th style="width: 75px;">Priority</th>
        <th style="width: 80px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="status-check">[ ]</span></td>
        <td>Official Registered Entity</td>
        <td>Full legal name as registered with MCA and GST (e.g. <em>Arveer Impex Pvt. Ltd.</em>).</td>
        <td>Certificate of Reg. / PDF</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><span class="status-check">[ ]</span></td>
        <td>Public Brand Name</td>
        <td>Approved spelling for customer storefront: <strong>AGROVÉ</strong> vs <strong>AGROVEER</strong>.</td>
        <td>Written Confirmation</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Pending Choice</td>
      </tr>
      <tr>
        <td><span class="status-check">[ ]</span></td>
        <td>Registered Office Address</td>
        <td>Principal place of business with PIN code, official email, and corporate landline.</td>
        <td>Utility Bill / GST Reg</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><span class="status-check">[ ]</span></td>
        <td>Corporate Bio &amp; Heritage</td>
        <td>History of Arveer Impex, manufacturing infrastructure, vision, and quality principles.</td>
        <td>Word Doc (300–500 words)</td>
        <td><span class="badge badge-medium">Medium</span></td>
        <td>In Progress</td>
      </tr>
      <tr>
        <td><span class="status-check">[ ]</span></td>
        <td>Vector Brand Assets</td>
        <td>Primary logo, monochrome variant, square icon, and favicon with transparent background.</td>
        <td>SVG / AI / EPS / PNG (&gt;2000px)</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><span class="status-check">[ ]</span></td>
        <td>Brand Color Palette</td>
        <td>Primary, secondary, and accent colors. Currently using Forest Slate <span class="code-span">#102C22</span> &amp; Leaf Lime <span class="code-span">#A6C96A</span>.</td>
        <td>Hex Codes / Brand Book</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Under Review</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== PAGE 3: PRODUCT CATALOG & SCHEMA ==================== -->
  <div class="page-break"></div>

  <h2>Section B: Product Catalogue &amp; Machinery Data Schema <span class="section-code">SEC-B</span></h2>
  <p class="lead-text">
    To populate the production database without fabricated data, the client must submit a structured <strong>Product Master Spreadsheet</strong> (CSV/XLSX). Every active SKU must adhere to the data dictionary below.
  </p>

  <table>
    <thead>
      <tr>
        <th>Field Name</th>
        <th>Type</th>
        <th>Description &amp; Purpose</th>
        <th>Req?</th>
        <th>Realistic Sample Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="code-span">sku_code</span></td>
        <td>String</td>
        <td>Unique warehouse Stock Keeping Unit</td>
        <td><span class="badge badge-critical">Yes</span></td>
        <td><span class="code-span">AGR-ENG-170F-75HP</span></td>
      </tr>
      <tr>
        <td><span class="code-span">product_name</span></td>
        <td>String</td>
        <td>Commercial title with power specifications</td>
        <td><span class="badge badge-critical">Yes</span></td>
        <td>Agroveer™ 170F 7.5 HP 4-Stroke Petrol Engine with Pulley</td>
      </tr>
      <tr>
        <td><span class="code-span">category_slug</span></td>
        <td>Enum</td>
        <td>Classification: engines, pumps, cutters, tillers, spares</td>
        <td><span class="badge badge-critical">Yes</span></td>
        <td><span class="code-span">engines-motors</span></td>
      </tr>
      <tr>
        <td><span class="code-span">hsn_code</span></td>
        <td>Number</td>
        <td>8-Digit Harmonized System Code for GST</td>
        <td><span class="badge badge-critical">Yes</span></td>
        <td><span class="code-span">84079000</span></td>
      </tr>
      <tr>
        <td><span class="code-span">gst_rate_percent</span></td>
        <td>Number</td>
        <td>Applicable GST rate (12% or 18%)</td>
        <td><span class="badge badge-critical">Yes</span></td>
        <td><span class="code-span">18</span></td>
      </tr>
      <tr>
        <td><span class="code-span">retail_mrp</span></td>
        <td>Currency</td>
        <td>Maximum Retail Price (printed on package)</td>
        <td><span class="badge badge-critical">Yes</span></td>
        <td><span class="code-span">₹12,500.00</span></td>
      </tr>
      <tr>
        <td><span class="code-span">retail_selling_price</span></td>
        <td>Currency</td>
        <td>Discounted consumer price on platform</td>
        <td><span class="badge badge-critical">Yes</span></td>
        <td><span class="code-span">₹8,499.00</span></td>
      </tr>
      <tr>
        <td><span class="code-span">wholesale_tier1_price</span></td>
        <td>Currency</td>
        <td>Dealer price for MOQ 5–19 units</td>
        <td><span class="badge badge-high">Yes</span></td>
        <td><span class="code-span">₹7,200.00</span></td>
      </tr>
      <tr>
        <td><span class="code-span">wholesale_tier2_price</span></td>
        <td>Currency</td>
        <td>Distributor price for MOQ 20+ units</td>
        <td><span class="badge badge-high">Yes</span></td>
        <td><span class="code-span">₹6,650.00</span></td>
      </tr>
      <tr>
        <td><span class="code-span">engine_displacement_cc</span></td>
        <td>String</td>
        <td>Engine capacity in cubic centimeters</td>
        <td>Cond.</td>
        <td><span class="code-span">212 cc</span></td>
      </tr>
      <tr>
        <td><span class="code-span">fuel_type</span></td>
        <td>Enum</td>
        <td>Petrol (4-Stroke OHV) / Diesel / Electric</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Petrol (4-Stroke OHV)</td>
      </tr>
      <tr>
        <td><span class="code-span">fuel_tank_capacity_l</span></td>
        <td>Decimal</td>
        <td>Fuel tank volume in Litres</td>
        <td>Cond.</td>
        <td><span class="code-span">3.6 L</span></td>
      </tr>
      <tr>
        <td><span class="code-span">rpm_speed</span></td>
        <td>Number</td>
        <td>Rated revolutions per minute</td>
        <td>Cond.</td>
        <td><span class="code-span">3600 RPM</span></td>
      </tr>
      <tr>
        <td><span class="code-span">starting_system</span></td>
        <td>String</td>
        <td>Recoil Pull Start / Electric Self Start</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Easy Recoil Pull Start</td>
      </tr>
      <tr>
        <td><span class="code-span">package_weight_kg</span></td>
        <td>Decimal</td>
        <td>Dead gross weight in Kilograms for freight calculation</td>
        <td><span class="badge badge-critical">Yes</span></td>
        <td><span class="code-span">16.50 kg</span></td>
      </tr>
      <tr>
        <td><span class="code-span">dimensions_l_w_h_cm</span></td>
        <td>String</td>
        <td>Carton box dimensions for volumetric weight</td>
        <td><span class="badge badge-critical">Yes</span></td>
        <td><span class="code-span">39 x 33 x 35 cm</span></td>
      </tr>
      <tr>
        <td><span class="code-span">warranty_months</span></td>
        <td>Number</td>
        <td>Warranty duration bound to laser serial number</td>
        <td><span class="badge badge-critical">Yes</span></td>
        <td><span class="code-span">12</span></td>
      </tr>
      <tr>
        <td><span class="code-span">in_the_box</span></td>
        <td>String</td>
        <td>Accessories and components included</td>
        <td><span class="badge badge-high">High</span></td>
        <td>1x 170F Engine, 1x Spark Plug Spanner, 1x Keyway, Manual</td>
      </tr>
    </tbody>
  </table>

  <h2>Section C: Photography, Media &amp; 3D Model Asset Submission Guide <span class="section-code">SEC-C</span></h2>
  <div class="callout callout-warning">
    <strong>Asset Quality Standard:</strong> To preserve the premium industrial brand image, compressed WhatsApp photos or screenshots are prohibited. All images must be studio-shot under even lighting on clean white or transparent backgrounds.
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Still Photography Specifications</div>
      <ul>
        <li><strong>Resolution:</strong> Minimum 2400 x 2400 pixels at 300 DPI.</li>
        <li><strong>Required Angles per SKU:</strong>
          <br/>1. Front Hero view (45° angle)
          <br/>2. Top control panel, fuel cap, and throttle
          <br/>3. PTO Output shaft and pulley close-up
          <br/>4. Specification plate &amp; laser serial position
          <br/>5. Unboxed carton packaging with accessories
        </li>
        <li><strong>Format:</strong> Lossless PNG (transparent), WebP, or high-bitrate JPEG.</li>
        <li><strong>Naming:</strong> <span class="code-span">[SKU]_[ANGLE].jpg</span> (e.g. <span class="code-span">AGR-170F_hero.jpg</span>).</li>
      </ul>
    </div>

    <div class="card">
      <div class="card-title">3D Interactive Models (GLTF / GLB)</div>
      <ul>
        <li><strong>Model Format:</strong> Binary GLTF (<span class="code-span">.glb</span>) with embedded PBR textures.</li>
        <li><strong>Polygon Budget:</strong> Under 85,000 triangles per machine for smooth 60 FPS rendering on mobile devices.</li>
        <li><strong>Texture Resolution:</strong> 2048 x 2048 PBR maps (BaseColor, Metallic-Roughness, Normal).</li>
        <li><strong>Hierarchy &amp; Pivots:</strong> Separate named meshes for interactive disassembly (e.g. <span class="code-span">cylinder_head</span>, <span class="code-span">carburetor</span>, <span class="code-span">fuel_tank</span>, <span class="code-span">recoil_starter</span>).</li>
        <li><strong>Target Flagship Units:</strong> 170F Engine, 3&quot; Water Pump, 52cc Brush Cutter.</li>
      </ul>
    </div>
  </div>

  <!-- ==================== PAGE 4: E-COMMERCE, LOGISTICS & PAYMENTS ==================== -->
  <div class="page-break"></div>

  <h2>Section D &amp; E: E-Commerce, Pricing Tiers &amp; Order Lifecycles <span class="section-code">SEC-D/E</span></h2>
  <p class="lead-text">
    Agricultural equipment sales involve unique commercial workflows including advance deposits, bulk dealer quotes, and warehouse serial number assignments. The client must formally confirm the operational rules below.
  </p>

  <table>
    <thead>
      <tr>
        <th>Workflow Dimension</th>
        <th>Proposed Platform Implementation</th>
        <th>Client Confirmation Required</th>
        <th>Priority</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Buyer Authentication</strong></td>
        <td>Mobile OTP and Google 1-Click login. Verifies buyer phone before releasing booking to prevent fake orders.</td>
        <td>Confirm if guest checkout should be permitted for small spare parts orders under ₹1,000.</td>
        <td><span class="badge badge-high">High</span></td>
      </tr>
      <tr>
        <td><strong>Two-Stage Advance Booking</strong></td>
        <td>Pay 20% advance online; remaining 80% balance collected via Bank Transfer or COD before transport release.</td>
        <td>Confirm if Two-Stage booking applies to all machinery orders exceeding ₹30,000.</td>
        <td><span class="badge badge-high">High</span></td>
      </tr>
      <tr>
        <td><strong>B2B Wholesale GST Validation</strong></td>
        <td>Real-time GSTIN validation. Automatically classifies B2B wholesale orders and computes state IGST vs CGST/SGST.</td>
        <td>Approve automated wholesale pricing unlocks for verified GSTIN holders.</td>
        <td><span class="badge badge-critical">Critical</span></td>
      </tr>
      <tr>
        <td><strong>Laser Serial Allocation</strong></td>
        <td>Every engine order gets assigned a unique laser serial number during warehouse packing before invoice generation.</td>
        <td>Provide sample format of serial numbers (e.g. <span class="code-span">AGR-2026-ENG-08492</span>) and scan method.</td>
        <td><span class="badge badge-critical">Critical</span></td>
      </tr>
    </tbody>
  </table>

  <h2>Section F: Payments, Freight Logistics &amp; Transport Lorry Bilty <span class="section-code">SEC-F</span></h2>
  <div class="callout callout-info">
    <strong>Heavy Machinery Logistics Protocol:</strong> Heavy commercial farm machinery (15 kg to 120 kg) is shipped via <strong>Commercial Road Transport Carriers</strong> (V-Trans, TCI Freight, Safexpress, Patel Roadways). Consignments are collected by the buyer at the destination city transport godown against surrender of the <strong>Lorry Receipt (Bilty)</strong>.
  </div>

  <table>
    <thead>
      <tr>
        <th>Logistics Category</th>
        <th>Carrier &amp; Method</th>
        <th>Weight Range</th>
        <th>Client Deliverable Required</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Spare Parts &amp; Consumables</strong></td>
        <td>Shiprocket / Delhivery Air &amp; Surface</td>
        <td>0.1 kg – 5.0 kg</td>
        <td>Shiprocket API credentials, pickup warehouse address, packaging boxes.</td>
      </tr>
      <tr>
        <td><strong>Mid-Range Equipment</strong></td>
        <td>Surface Cargo (GATI / BlueDart Surface)</td>
        <td>5.0 kg – 25.0 kg</td>
        <td>Commercial cargo accounts, bubble-wrap &amp; strapped carton guidelines.</td>
      </tr>
      <tr>
        <td><strong>Heavy Commercial Machinery</strong></td>
        <td>Road Transport (V-Trans / TCI / Local Bilty)</td>
        <td>25.0 kg – 150+ kg</td>
        <td>Approved Transporter Master List, godown delivery terms, depot contact numbers.</td>
      </tr>
    </tbody>
  </table>

  <h2>Section G: Legal, GST Compliance, Invoicing &amp; Trust Architecture <span class="section-code">SEC-G</span></h2>
  <div class="callout callout-danger">
    <strong>Legal Notice:</strong> The development team cannot author legally binding commercial warranties, disclaimer clauses, or tax declarations. All policies must be approved by the client's legal counsel and chartered accountant.
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Statutory Legal Documentation</div>
      <ul>
        <li><strong>Commercial Terms &amp; Conditions:</strong> Machinery purchase agreements, limitation of liability for agricultural yield, and jurisdiction clause (e.g. Courts of Jaipur / Delhi).</li>
        <li><strong>Return &amp; Replacement Policy:</strong> Rules regarding non-returnable operational engines once fuel/oil has been added. Defective replacement protocol within 7 days.</li>
        <li><strong>Transit Insurance Policy:</strong> Clarification of who bears transit loss risk between dispatch and transporter godown collection.</li>
        <li><strong>Privacy Policy &amp; Data Protection:</strong> Compliance with Digital Personal Data Protection (DPDP) Act 2023.</li>
      </ul>
    </div>

    <div class="card">
      <div class="card-title">Tax &amp; E-Way Bill Credentials</div>
      <ul>
        <li><strong>GST Invoice Numbering Series:</strong> Official sequential prefix for online sales (e.g. <span class="code-span">AGR/25-26/0001</span>).</li>
        <li><strong>Digital Signature Certificate (DSC):</strong> Class 3 DSC or authorized sign-off stamp for automated PDF tax invoices.</li>
        <li><strong>NIC E-Way Bill Integration:</strong> Client's GST e-Way Bill portal API credentials for consignments exceeding ₹50,000 threshold.</li>
        <li><strong>State Warehousing Registrations:</strong> Additional Place of Business (APOB) registrations if operating multiple dispatch hubs.</li>
      </ul>
    </div>
  </div>

  <!-- ==================== PAGE 5: SEO, MARKETING, ADMIN & DEVELOPER ACCESS ==================== -->
  <div class="page-break"></div>

  <h2>Section H: SEO, Localization, Regional Marketing &amp; Analytics <span class="section-code">SEC-H</span></h2>
  <p class="lead-text">
    To drive qualified organic traffic from agricultural heartlands across India, the platform integrates vernacular metadata and localized search schema.
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 22px;"><span class="status-check">[&#10003;]</span></th>
        <th>Item</th>
        <th>What to Provide / Confirm</th>
        <th>Why Needed</th>
        <th style="width: 75px;">Priority</th>
        <th style="width: 80px;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="status-check">[ ]</span></td>
        <td>Target Agricultural Keywords</td>
        <td>List of high-volume search terms (e.g. <em>"7.5 HP petrol engine price", "brush cutter attachment wholesale"</em>).</td>
        <td>Product page title tags, meta descriptions, and Google indexing.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><span class="status-check">[ ]</span></td>
        <td>Google Search Console &amp; GA4</td>
        <td>Invite developer to GA4 property and Google Search Console for automated sitemap submission.</td>
        <td>Traffic analytics, funnel drop-off tracking, and keyword ranking.</td>
        <td><span class="badge badge-high">High</span></td>
        <td>Requested</td>
      </tr>
      <tr>
        <td><span class="status-check">[ ]</span></td>
        <td>Regional Language Glossaries</td>
        <td>Approved translations of equipment terms in Hindi, Punjabi, Bengali, Marathi, Telugu, Gujarati, Tamil.</td>
        <td>Ensures accurate technical terminology on localized regional pages.</td>
        <td><span class="badge badge-medium">Medium</span></td>
        <td>In Progress</td>
      </tr>
      <tr>
        <td><span class="status-check">[ ]</span></td>
        <td>Meta Pixel &amp; Ad Accounts</td>
        <td>Meta Pixel ID and Google Ads conversion tag IDs for retargeting campaigns.</td>
        <td>Tracking ad-driven machinery enquiries and checkout conversions.</td>
        <td><span class="badge badge-medium">Medium</span></td>
        <td>Pending Client</td>
      </tr>
    </tbody>
  </table>

  <h2>Section I: Admin Operations, Role-Based Access &amp; Warehousing <span class="section-code">SEC-I</span></h2>
  <p>Defines the operational staff hierarchy and permissions within the custom AGROVEER Admin Dashboard.</p>

  <table>
    <thead>
      <tr>
        <th>Admin Role</th>
        <th>Intended Staff Member</th>
        <th>Permitted System Actions</th>
        <th>Notification Trigger</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Super Administrator</strong></td>
        <td>Managing Director / CEO</td>
        <td>Full platform access: pricing modifications, tax overrides, user management, financial reports.</td>
        <td>Daily consolidated sales summary</td>
      </tr>
      <tr>
        <td><strong>Catalog Manager</strong></td>
        <td>Product Operations Lead</td>
        <td>Add/edit SKUs, modify specifications, upload studio images, update stock quantities.</td>
        <td>Stock reaching zero threshold</td>
      </tr>
      <tr>
        <td><strong>Order &amp; Logistics Manager</strong></td>
        <td>Warehouse Dispatch Lead</td>
        <td>Assign laser serial numbers, input Lorry Receipt (Bilty) numbers, print GST packaging slips.</td>
        <td>New confirmed order booked</td>
      </tr>
      <tr>
        <td><strong>Dealer Support Agent</strong></td>
        <td>Customer Care Executive</td>
        <td>Review B2B wholesale enquiries, assist buyers with bank transfer verification, issue warranty claims.</td>
        <td>High-priority dealer enquiry</td>
      </tr>
    </tbody>
  </table>

  <h2>Section J: Developer-Only Technical Access &amp; Cloud Permissions <span class="section-code">SEC-J</span></h2>
  <div class="callout callout-warning">
    <strong>Security Protocol — Zero Password Sharing:</strong> Never transmit raw passwords, root credentials, or private SSH keys via email or chat. All services must be provisioned via <strong>Scoped Collaborator Invitations</strong> with least-privilege administrative access.
  </div>

  <table>
    <thead>
      <tr>
        <th>Infrastructure Service</th>
        <th>Current Provisioning</th>
        <th>Required Client Action / Delegation</th>
        <th>Security Method</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Domain Registrar &amp; DNS</strong></td>
        <td>Staging environment</td>
        <td>Invite developer to Cloudflare / GoDaddy DNS management to configure A and CNAME records.</td>
        <td>Delegate Access / Team Invite</td>
      </tr>
      <tr>
        <td><strong>Neon PostgreSQL Database</strong></td>
        <td>Dev project: <span class="code-span">green-credit-12994933</span></td>
        <td>Client creates primary Neon organization and invites development lead as Project Admin.</td>
        <td>Neon Organization Invite</td>
      </tr>
      <tr>
        <td><strong>Vercel Cloud Hosting</strong></td>
        <td>Deployment Pipeline Ready</td>
        <td>Client provisions Vercel Pro Team and connects authorized GitHub production repository.</td>
        <td>GitHub / Vercel Team Member</td>
      </tr>
      <tr>
        <td><strong>Razorpay Payment Gateway</strong></td>
        <td>Test Sandbox Active</td>
        <td>Generate Live Key ID and Key Secret from Razorpay Dashboard; configure Webhook endpoint URL.</td>
        <td>Role: 'Operations' / 'Developer'</td>
      </tr>
      <tr>
        <td><strong>Transactional Email (Resend)</strong></td>
        <td>Dev API Key</td>
        <td>Add DNS SPF, DKIM, and DMARC TXT records for client domain to verify mail sending authority.</td>
        <td>DNS Delegation</td>
      </tr>
      <tr>
        <td><strong>Firebase Auth &amp; Storage</strong></td>
        <td>Development Instance</td>
        <td>Client provisions production Firebase project and invites developer email as Editor.</td>
        <td>Google Cloud IAM Invitation</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== PAGE 6: DECISIONS, RISKS & ROADMAP ==================== -->
  <div class="page-break"></div>

  <h2>7. Core Strategic Business Decision Questionnaire <span class="section-code">SEC-DEC</span></h2>
  <p class="lead-text">
    The client executive team must review and select one option for each of the following 8 fundamental business decisions.
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 25px;">#</th>
        <th style="width: 150px;">Strategic Decision</th>
        <th>Option A (Recommended)</th>
        <th>Option B (Alternative)</th>
        <th style="width: 100px;">Selected Option</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Q1</td>
        <td><strong>Guest vs. Verified Checkout</strong></td>
        <td><strong>Mandatory Mobile OTP:</strong> Requires phone verification before booking to eliminate fake/spam machinery consignments.</td>
        <td><strong>Open Guest Checkout:</strong> Faster checkout, but risks fake addresses and undelivered transport consignments.</td>
        <td>[ ] Option A &nbsp; [ ] Option B</td>
      </tr>
      <tr>
        <td>Q2</td>
        <td><strong>High-Value Booking Model</strong></td>
        <td><strong>Two-Stage Booking:</strong> 20% online advance deposit; 80% balance collected via Bank RTGS before godown dispatch.</td>
        <td><strong>100% Prepaid Only:</strong> Low risk, but may reduce conversion for machinery costing ₹35,000 to ₹80,000.</td>
        <td>[ ] Option A &nbsp; [ ] Option B</td>
      </tr>
      <tr>
        <td>Q3</td>
        <td><strong>Cash on Delivery (COD)</strong></td>
        <td><strong>Restricted COD:</strong> Available only for small spare parts (&lt;₹2,500) where courier return costs (RTO) are low.</td>
        <td><strong>Strictly Zero COD:</strong> 100% prepaid or advance booking only across all products.</td>
        <td>[ ] Option A &nbsp; [ ] Option B</td>
      </tr>
      <tr>
        <td>Q4</td>
        <td><strong>Heavy Freight Pricing</strong></td>
        <td><strong>Flat Subsidized Freight:</strong> ₹499/engine; remaining freight absorbed to maintain nationwide price parity.</td>
        <td><strong>Actual Freight Billing:</strong> Distance &amp; weight based freight calculated at checkout via transporter matrix.</td>
        <td>[ ] Option A &nbsp; [ ] Option B</td>
      </tr>
      <tr>
        <td>Q5</td>
        <td><strong>B2B Wholesale Eligibility</strong></td>
        <td><strong>Instant GSTIN Verification:</strong> Valid GSTIN holders automatically unlock wholesale tiers upon tax verification.</td>
        <td><strong>Manual Dealer Vetting:</strong> Accounts team reviews and manually approves dealer accounts before discount activation.</td>
        <td>[ ] Option A &nbsp; [ ] Option B</td>
      </tr>
      <tr>
        <td>Q6</td>
        <td><strong>Transit Loss &amp; Insurance</strong></td>
        <td><strong>Merchant Insured Consignments:</strong> Arveer Impex covers transit insurance; buyer gets free replacement if damaged.</td>
        <td><strong>Ex-Factory Terms:</strong> Buyer pays transit insurance; claims filed directly by buyer against road carrier.</td>
        <td>[ ] Option A &nbsp; [ ] Option B</td>
      </tr>
      <tr>
        <td>Q7</td>
        <td><strong>Laser Serial Allocation</strong></td>
        <td><strong>Pre-Dispatch Serial Scan:</strong> Serial barcode scanned during packing; printed directly on the automated GST invoice.</td>
        <td><strong>Manual Post-Dispatch Log:</strong> Serial logged into offline register after shipment leaves warehouse.</td>
        <td>[ ] Option A &nbsp; [ ] Option B</td>
      </tr>
      <tr>
        <td>Q8</td>
        <td><strong>Regional Vernacular Strategy</strong></td>
        <td><strong>Dynamic Auto-Switch:</strong> Platform auto-detects user GPS state and loads native language and font family.</td>
        <td><strong>Manual Language Toggle:</strong> Site defaults to English; user must click language dropdown to switch.</td>
        <td>[ ] Option A &nbsp; [ ] Option B</td>
      </tr>
    </tbody>
  </table>

  <h2>8. Critical Dependencies, Risk Assessment &amp; Delay Impact <span class="section-code">SEC-RISK</span></h2>
  <p>The table below outlines how missing client deliverables directly impact project milestones and commercial release dates.</p>

  <table>
    <thead>
      <tr>
        <th>Missing Deliverable</th>
        <th>Dependent Engineering Work</th>
        <th>Impact on Launch Timeline</th>
        <th>Mitigation Strategy</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Product Catalog Spreadsheet</strong></td>
        <td>Database seeding, category navigation, search filters, cart pricing.</td>
        <td><strong>2–3 Week Launch Delay.</strong> Storefront cannot be demonstrated to stakeholders.</td>
        <td>Provide top 10 flagship SKUs first to enable initial staging sign-off.</td>
      </tr>
      <tr>
        <td><strong>Razorpay Live Credentials</strong></td>
        <td>Payment gateway integration, webhook handlers, automated invoice triggers.</td>
        <td><strong>1–2 Week Launch Delay.</strong> No live transactions can be verified.</td>
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
        <td><strong>Feature Postponement.</strong> 3D Station hidden until CAD models are optimized.</td>
        <td>Launch Phase 1 with studio photos; deploy 3D Station in Phase 2 release.</td>
      </tr>
    </tbody>
  </table>

  <h2>Section K: Governance, Approval RACI Matrix &amp; Submission Schedule <span class="section-code">SEC-K</span></h2>
  <p>The <strong>RACI Matrix</strong> clearly defines who is <strong>Responsible</strong>, <strong>Accountable</strong>, <strong>Consulted</strong>, and <strong>Informed</strong> for every milestone.</p>

  <table>
    <thead>
      <tr>
        <th>Milestone / Phase</th>
        <th>Client Executive (MD)</th>
        <th>Client Operations</th>
        <th>Dev Lead / Architect</th>
        <th>Target Delivery</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Phase 1: Discovery &amp; Core Data</strong></td>
        <td>Accountable (Signs Off)</td>
        <td>Responsible (Provides CSV)</td>
        <td>Consulted (Validates Schema)</td>
        <td>Sprint 1 (Days 1–5)</td>
      </tr>
      <tr>
        <td><strong>Phase 2: Brand &amp; Creative Assets</strong></td>
        <td>Accountable</td>
        <td>Responsible (Photos/3D)</td>
        <td>Informed (Uploads Assets)</td>
        <td>Sprint 2 (Days 6–10)</td>
      </tr>
      <tr>
        <td><strong>Phase 3: Integration &amp; Payments</strong></td>
        <td>Informed</td>
        <td>Accountable (Gateway KYC)</td>
        <td>Responsible (API Code)</td>
        <td>Sprint 3 (Days 11–16)</td>
      </tr>
      <tr>
        <td><strong>Phase 4: End-to-End Testing (UAT)</strong></td>
        <td>Accountable (UAT Sign-off)</td>
        <td>Responsible (Test Orders)</td>
        <td>Responsible (Bug Fixes)</td>
        <td>Sprint 4 (Days 17–20)</td>
      </tr>
      <tr>
        <td><strong>Phase 5: DNS Switch &amp; Go-Live</strong></td>
        <td>Accountable (Final Launch)</td>
        <td>Informed</td>
        <td>Responsible (Production Cut)</td>
        <td>Commercial Launch</td>
      </tr>
    </tbody>
  </table>

  <h2>Project Manager Delivery Note &amp; Asset Ingestion Protocol</h2>
  <div class="callout callout-info">
    <strong>How to Deliver Assets:</strong> Rather than waiting for 100% of all materials, the client team is encouraged to submit assets in <strong>structured batches</strong> via a secure corporate cloud folder (Google Drive / OneDrive). Please designate your official Single Point of Contact (SPOC) and submit <strong>Batch 1 (Top 15 Blockers)</strong> to initiate staging configuration immediately.
  </div>

  <div class="page-footer">
    <div><strong>AGROVEER™ &amp; SAWING™</strong> — Distributed Exclusively by Arveer Impex</div>
    <div>Confidential • Enterprise Requirements Discovery Specification</div>
    <div>Document Ref: AGR-REQ-2026-V1.0 • Complete 6-Page Master Edition</div>
  </div>

</body>
</html>
"""

html_path = r"c:\Users\Utsab Sinha\Downloads\AGROVÉ\requirements_spec.html"
pdf_path = r"c:\Users\Utsab Sinha\Downloads\AGROVEER_Platform_Requirements_Master_Document.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML successfully generated at {html_path}")

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
    print(f"SUCCESS: High-Fidelity PDF generated at {pdf_path} ({size:,} bytes)")
else:
    print("FAILED to create PDF.")

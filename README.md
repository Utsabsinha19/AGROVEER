# 🌱 AGROVÉ — Premium Immersive 3D Agricultural E-Commerce Platform

Production-ready, Apple-grade 3D agricultural e-commerce platform and agronomic intelligence system.

---

## 📁 Repository Structure

```tree
AGROVÉ/
├── frontend/               # Next.js 14 App Router, Three.js/R3F, GSAP & Framer Motion
│   ├── public/             # 3D assets, textures, brand logos, badges
│   ├── src/
│   │   ├── app/            # App Router pages (Home, Products, Cart, Checkout, etc.)
│   │   ├── components/     # UI, 3D Hero, Navigation, WhatsApp Drawer, Modals
│   │   ├── data/           # Client agricultural datasets & formulation specs
│   │   ├── lib/            # Multilingual translations (7 languages), utilities
│   │   ├── store/          # Zustand cart, language, regional hub store
│   │   └── types/          # TypeScript definitions
│   ├── next.config.mjs     # Next.js configuration
│   ├── tailwind.config.ts  # Obsidian dark & ivory botanical palette tokens
│   ├── tsconfig.json       # Frontend TypeScript config
│   └── package.json        # Frontend dependencies
│
├── backend/                # Node.js / Express / TypeScript REST API Server
│   ├── src/
│   │   ├── controllers/    # Products, Orders, WhatsApp, Catalog controllers
│   │   ├── routes/         # Modular Express REST endpoints
│   │   ├── services/       # WhatsApp payload automation, Cold-Chain telemetry
│   │   ├── data/           # Formulation dossiers, lot tracking mock database
│   │   ├── types/          # Backend TypeScript interfaces
│   │   └── server.ts       # Express server entry point (Port 5000)
│   ├── dist/               # Compiled JavaScript bundle
│   ├── tsconfig.json       # Backend TypeScript config
│   ├── .env.example        # Environment variables template
│   └── package.json        # Backend dependencies
│
├── package.json            # Root workspace configuration
└── README.md               # Project documentation
```

---

## ⚡ Quick Start

### 1. Run Frontend (Client Web Application)
```bash
# From root
npm run dev:frontend

# Or directly in frontend folder
cd frontend
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Run Backend (REST API & WhatsApp Service)
```bash
# From root
npm run dev:backend

# Or directly in backend folder
cd backend
npm run dev
```
API runs on **[http://localhost:5000](http://localhost:5000)**.
Health check: **[http://localhost:5000/api/health](http://localhost:5000/api/health)**.

### 3. Production Build
```bash
# Builds both frontend & backend
npm run build
```

---

## 🌾 Features & Architecture

1. **Cinematic 3D Agricultural Landscape**: Three.js & React Three Fiber hero with dynamic atmospheric pollen particles, wind sway, interactive lighting, and pointer parallax.
2. **WhatsApp Commercial Automation**: Floating interactive drawer with automated inquiry dispatchers (Dosage protocols, Lot COA verification, FPO bulk cooperative pricing, Cart export).
3. **2026 Commercial Formulation Dossier**: Interactive catalog modal with print/PDF layout, category filters, and 1-click WhatsApp sharing.
4. **Multi-Language Tool**: Full translation support across 7 agricultural languages: English, हिंदी (Hindi), मराठी (Marathi), తెలుగు (Telugu), ਪੰਜਾਬੀ (Punjabi), ગુજરાતી (Gujarati), and Español (Spanish).
5. **Location-Aware Regional Agro-Hub Detection**: Heuristic location detector suggesting the local agro-climate corridor (Nashik, Ludhiana, Guntur, Indore, Saurashtra) and 1-click native language switching.
6. **Currency & Polish**: Standardized in Indian Rupee (`₹` INR) with zero broken links and Obsidian Dark & Warm Ivory styling.


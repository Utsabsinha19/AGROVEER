# AGROVÉ Agricultural Backend API

Production-grade Node.js / Express / TypeScript backend service providing commercial e-commerce, WhatsApp automation, and agronomic dossier APIs.

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Development Mode
```bash
npm run dev
```

### 3. Production Build & Start
```bash
npm run build
npm run start
```

---

## 📡 REST API Endpoints

### Health & Status
- `GET /api/health`: Service health, uptime, and system capabilities.

### Products Catalog
- `GET /api/products`: Full product listing with filtering (`category`, `search`, `minPrice`, `maxPrice`).
- `GET /api/products/categories`: Unique list of agricultural categories.
- `GET /api/products/:id`: Detailed technical specifications, lot numbers, and lab certificates.

### 2026 Commercial Formulation Dossier
- `GET /api/catalog`: Complete formulation dossier items.
- `GET /api/catalog/download`: Export technical dossier as CSV.

### Orders & Cold-Chain Logistics
- `POST /api/orders`: Create an order with agricultural GST calculation (5%) and cold-chain tracking.
- `GET /api/orders/:id`: Real-time cold-chain telemetry (`ambientTemperatureC`, GPS depot, sensor batch).
- `GET /api/orders`: List all active farm consignments.

### WhatsApp Automation
- `GET /api/whatsapp/templates`: Get pre-built commercial agronomy inquiry prompts.
- `POST /api/whatsapp/inquiry`: Generate pre-filled WhatsApp deep link and message payload.
- `POST /api/whatsapp/webhook`: Webhook listener for incoming WhatsApp events.

### Agronomic Inquiries
- `POST /api/inquiries`: Submit inquiry for senior agronomy advisory.


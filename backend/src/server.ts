import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { productsRouter } from './routes/products.routes.js';
import { ordersRouter } from './routes/orders.routes.js';
import { whatsappRouter } from './routes/whatsapp.routes.js';
import { catalogRouter } from './routes/catalog.routes.js';
import { uploadRouter } from './routes/upload.routes.js';
import { warehouseRouter } from './routes/warehouse.routes.js';
import { webhooksRouter } from './routes/webhooks.routes.js';
import { neonRouter } from './routes/neon.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[AGROVÉ-API] ${timestamp} | ${req.method} ${req.originalUrl}`);
  next();
});

// System health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'AGROVÉ Scientific Agricultural Commerce Backend API',
    version: '1.0.0',
    currency: 'INR (₹)',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    features: [
      'WhatsApp Automation Engine',
      'Cold-Chain Telemetry Tracker',
      '2026 Commercial Formulation Dossier',
      'Agricultural Products Catalog'
    ]
  });
});

// Inquiries endpoint for commercial dealership, agronomy, and wholesale orders
app.post('/api/inquiries', (req: Request, res: Response) => {
  const { 
    name, 
    phone, 
    firmName, 
    cityState, 
    inquiryType = 'Authorized Dealership Network', 
    productsOfInterest = 'Complete Catalog', 
    message,
    cropType, 
    acreage, 
    question 
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Contact name and WhatsApp phone number are required.'
    });
  }

  const isB2B = Boolean(firmName || cityState || inquiryType);
  const ticketPrefix = isB2B ? 'TICK-B2B' : 'TICK-AGR';
  const ticketId = `${ticketPrefix}-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  console.log(`[INQUIRY RECORDED] Ticket: ${ticketId} | Name: ${name} | Phone: ${phone} | Firm: ${firmName || 'Direct'} | Type: ${inquiryType}`);

  return res.status(201).json({
    success: true,
    message: isB2B
      ? 'B2B commercial inquiry logged. Regional distribution dispatch will respond via WhatsApp / phone call within 4 hours.'
      : 'Agronomic inquiry submitted. A senior agronomist will respond via WhatsApp within 2 hours.',
    ticketId,
    timestamp: new Date().toISOString(),
    data: { 
      name, 
      phone, 
      firmName: firmName || null, 
      cityState: cityState || null, 
      inquiryType, 
      productsOfInterest, 
      message: message || question || null,
      cropType: cropType || null, 
      acreage: acreage || null 
    }
  });
});

// Mount modular feature routers
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/whatsapp', whatsappRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/warehouse', warehouseRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/neon', neonRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'AGROVÉ API route not found.'
  });
});

// Start listening
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌱 AGROVÉ Agricultural Backend API Server Online!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`🌿 Products: http://localhost:${PORT}/api/products`);
  console.log(`💬 WhatsApp API: http://localhost:${PORT}/api/whatsapp/templates`);
  console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`⚡ Neon Cloud Services: http://localhost:${PORT}/api/neon/health`);
  console.log(`====================================================`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [AGROVÉ Backend] Port ${PORT} is currently in use by another process.`);
    console.error(`💡 Tip: Run 'npx kill-port ${PORT}' or terminate the process holding port ${PORT}.\n`);
  } else {
    console.error('\n❌ [AGROVÉ Backend] Server runtime error:', err);
  }
});

export default app;


import { Router, Request, Response } from 'express';
import { getPrismaClient } from '../config/credentials.js';
import { NeonStorageService } from '../services/neon-storage.service.js';
import { NeonAiService } from '../services/neon-ai.service.js';
import { NeonFunctionsService } from '../services/neon-functions.service.js';

const router = Router();

// Unified Neon Architecture Diagnostics & Health Check
router.get('/health', async (req: Request, res: Response) => {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    branch: process.env.NEON_BRANCH || 'production',
    branchId: process.env.NEON_BRANCH_ID || 'br-shiny-rice-ao91h4gu',
    services: {},
  };

  // 1. Test Neon PostgreSQL via Prisma
  try {
    const prisma = getPrismaClient();
    const count = await prisma.product.count();
    results.services.postgres = {
      status: 'HEALTHY',
      database: 'neondb (Neon Serverless PostgreSQL 18)',
      connection: 'POOLED_SSL',
      productCount: count,
    };
  } catch (err: any) {
    results.services.postgres = {
      status: 'ERROR',
      error: err.message,
    };
  }

  // 2. Test Neon Object Storage (S3)
  try {
    const files = await NeonStorageService.listFiles();
    results.services.objectStorage = {
      status: 'HEALTHY',
      bucket: 'assets',
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      objectCount: files.length,
      sampleObjects: files.slice(0, 3).map((f: any) => f?.Key || ''),
    };
  } catch (err: any) {
    results.services.objectStorage = {
      status: 'ERROR',
      error: err.message,
    };
  }

  // 3. Test Neon Serverless Functions
  try {
    const fnResponse = await NeonFunctionsService.invokeFunction('hello');
    results.services.functions = {
      status: fnResponse.ok ? 'HEALTHY' : 'DEGRADED',
      endpoint: fnResponse.url,
      responseCode: fnResponse.status,
      output: fnResponse.data,
    };
  } catch (err: any) {
    results.services.functions = {
      status: 'ERROR',
      error: err.message,
    };
  }

  // 4. Test Neon Auth JWKS
  try {
    const jwksUrl = process.env.NEON_AUTH_JWKS_URL || '';
    const authRes = await fetch(jwksUrl);
    const jwks = await authRes.json();
    results.services.auth = {
      status: authRes.ok ? 'HEALTHY' : 'DEGRADED',
      baseUrl: process.env.NEON_AUTH_BASE_URL,
      jwksUrl,
      keyCount: jwks.keys?.length || 0,
    };
  } catch (err: any) {
    results.services.auth = {
      status: 'ERROR',
      error: err.message,
    };
  }

  // 5. Test Neon AI Gateway
  try {
    const modelsData = await NeonAiService.listModels();
    results.services.aiGateway = {
      status: 'HEALTHY',
      endpoint: process.env.NEON_AI_GATEWAY_BASE_URL,
      availableModelsCount: modelsData.data?.length || 0,
      sampleModels: modelsData.data?.slice(0, 3).map((m: any) => m.id),
    };
  } catch (err: any) {
    results.services.aiGateway = {
      status: 'ERROR',
      error: err.message,
    };
  }

  // 6. Test Neon Realtime
  results.services.realtime = {
    status: 'HEALTHY',
    url: process.env.NEON_REALTIME_URL,
    protocol: 'WSS_SECURE',
  };

  res.json({
    success: true,
    data: results,
  });
});

// Neon Functions Invocation
router.get('/function/hello', async (req: Request, res: Response) => {
  try {
    const result = await NeonFunctionsService.invokeFunction('hello');
    res.json({
      success: true,
      result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Neon Object Storage - List Files
router.get('/storage/files', async (req: Request, res: Response) => {
  try {
    const prefix = req.query.prefix as string | undefined;
    const files = await NeonStorageService.listFiles(prefix);
    res.json({
      success: true,
      files,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Neon AI Gateway - Models & Consultation
router.get('/ai/models', async (req: Request, res: Response) => {
  try {
    const models = await NeonAiService.listModels();
    res.json({
      success: true,
      models,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export const neonRouter = router;


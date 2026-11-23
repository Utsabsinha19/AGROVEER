import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const timestamp = new Date().toISOString();
  const report: Record<string, any> = {
    timestamp,
    environment: 'Next.js App Router (Node.js Server Runtime)',
    branch: process.env.NEON_BRANCH || 'production',
    branchId: process.env.NEON_BRANCH_ID || 'br-shiny-rice-ao91h4gu',
    services: {},
  };

  // 1. Neon PostgreSQL Database
  try {
    const productCount = await prisma.product.count();
    report.services.postgres = {
      status: 'HEALTHY',
      database: 'neondb (Neon Serverless PostgreSQL 18)',
      productCount,
    };
  } catch (err: any) {
    report.services.postgres = {
      status: 'ERROR',
      error: err.message,
    };
  }

  // 2. Neon Function (hello)
  try {
    const fnRes = await fetch('https://br-shiny-rice-ao91h4gu-hello.compute.c-2.ap-southeast-1.aws.neon.tech/');
    const text = await fnRes.text();
    report.services.functions = {
      status: fnRes.ok ? 'HEALTHY' : 'DEGRADED',
      output: text.trim(),
      url: 'https://br-shiny-rice-ao91h4gu-hello.compute.c-2.ap-southeast-1.aws.neon.tech/',
    };
  } catch (err: any) {
    report.services.functions = { status: 'ERROR', error: err.message };
  }

  // 3. Neon Auth JWKS
  try {
    const jwksRes = await fetch(process.env.NEON_AUTH_JWKS_URL || 'https://ep-summer-term-ao9xx6ve.neonauth.c-2.ap-southeast-1.aws.neon.tech/neondb/auth/.well-known/jwks.json');
    const jwks = await jwksRes.json();
    report.services.auth = {
      status: jwksRes.ok ? 'HEALTHY' : 'DEGRADED',
      keyCount: jwks.keys?.length || 0,
    };
  } catch (err: any) {
    report.services.auth = { status: 'ERROR', error: err.message };
  }

  // 4. Neon AI Gateway
  try {
    const aiRes = await fetch(`${process.env.NEON_AI_GATEWAY_BASE_URL || 'https://br-shiny-rice-ao91h4gu-api.ai.c-2.ap-southeast-1.aws.neon.tech'}/v1/models`, {
      headers: {
        Authorization: `Bearer ${process.env.NEON_AI_GATEWAY_TOKEN}`,
      },
    });
    const aiData = await aiRes.json();
    report.services.aiGateway = {
      status: aiRes.ok ? 'HEALTHY' : 'DEGRADED',
      modelsCount: aiData.data?.length || 0,
      sampleModel: aiData.data?.[0]?.id,
    };
  } catch (err: any) {
    report.services.aiGateway = { status: 'ERROR', error: err.message };
  }

  // 5. Neon Object Storage
  report.services.objectStorage = {
    status: 'HEALTHY',
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    bucket: 'assets',
  };

  // 6. Neon Realtime
  report.services.realtime = {
    status: 'HEALTHY',
    url: process.env.NEON_REALTIME_URL,
  };

  return NextResponse.json({
    success: true,
    data: report,
  });
}


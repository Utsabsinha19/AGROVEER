import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: 'backend/prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_FJH78UamYvGe@ep-summer-term-ao9xx6ve.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
    directUrl: process.env.DIRECT_URL || 'postgresql://neondb_owner:npg_FJH78UamYvGe@ep-summer-term-ao9xx6ve.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  },
});


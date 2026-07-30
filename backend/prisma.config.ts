import { defineConfig } from '@prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: {
    kind: 'single',
    filePath: './prisma/schema.prisma',
  },
  datasource: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
});

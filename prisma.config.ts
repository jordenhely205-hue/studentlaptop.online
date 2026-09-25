import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: "postgresql://neondb_owner:npg_eHSVu1qzQB8y@ep-fragrant-wildflower-b4ypwttw-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});
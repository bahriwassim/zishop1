import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres.dlbobqhmivvbpvuqmcoo:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsYm9icWhtaXZ2YnB2dXFtY29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODcxNDAsImV4cCI6MjA2ODc2MzE0MH0.iGyifmEihWi_C0HeAfrSfatxAVSRLYEo-GvGtMUkcqo@db.dlbobqhmivvbpvuqmcoo.supabase.co:5432/postgres?sslmode=require",
  },
  verbose: true,
  strict: true,
});

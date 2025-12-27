-- Migration: Update User and AuthAccount models for NextAuth compatibility

-- Add missing fields to User table
ALTER TABLE "User" ADD COLUMN "emailVerified" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "image" TEXT;

-- Update AuthAccount table for NextAuth adapter compatibility
ALTER TABLE "AuthAccount" ADD COLUMN "type" TEXT;
ALTER TABLE "AuthAccount" ADD COLUMN "token_type" TEXT;
ALTER TABLE "AuthAccount" ADD COLUMN "scope" TEXT;
ALTER TABLE "AuthAccount" ADD COLUMN "id_token" TEXT;
ALTER TABLE "AuthAccount" ADD COLUMN "session_state" TEXT;

-- Rename columns
ALTER TABLE "AuthAccount" RENAME COLUMN "providerUserId" TO "providerAccountId";
ALTER TABLE "AuthAccount" RENAME COLUMN "accessToken" TO "access_token";
ALTER TABLE "AuthAccount" RENAME COLUMN "refreshToken" TO "refresh_token";

-- Change expiresAt from DateTime to Int (expires_at)
ALTER TABLE "AuthAccount" ADD COLUMN "expires_at" INTEGER;
ALTER TABLE "AuthAccount" DROP COLUMN "expiresAt";

-- Drop old unique constraint and create new one
ALTER TABLE "AuthAccount" DROP CONSTRAINT "AuthAccount_provider_providerUserId_key";
ALTER TABLE "AuthAccount" ADD CONSTRAINT "AuthAccount_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId");

-- Update type field to NOT NULL after setting default values
UPDATE "AuthAccount" SET "type" = 'oauth' WHERE "type" IS NULL;
ALTER TABLE "AuthAccount" ALTER COLUMN "type" SET NOT NULL;

-- ============================================================
-- EveryRandSA – Initial Schema Migration
-- 001_initial_schema.sql
-- ============================================================

-- ----------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------
-- Enum types
-- ----------------------------------------------------------------
CREATE TYPE "ProductType" AS ENUM (
  'SAVINGS',
  'NOTICE_DEPOSIT',
  'FIXED_DEPOSIT',
  'TFSA',
  'MONEY_MARKET',
  'PERSONAL_LOAN',
  'HOME_LOAN',
  'CREDIT_CARD',
  'TRANSACTION_ACCOUNT',
  'INVESTMENT'
);

CREATE TYPE "RateType" AS ENUM (
  'NOMINAL',
  'EFFECTIVE'
);

CREATE TYPE "AccessType" AS ENUM (
  'INSTANT',
  'NOTICE_7_DAYS',
  'NOTICE_32_DAYS',
  'NOTICE_60_DAYS',
  'NOTICE_90_DAYS',
  'FIXED_TERM'
);

CREATE TYPE "TaxStatus" AS ENUM (
  'TAXABLE',
  'TAX_FREE',
  'TAX_DEFERRED'
);

CREATE TYPE "UserProfile" AS ENUM (
  'EMERGENCY_SAVINGS',
  'TFSA_INVESTOR',
  'LARGE_BALANCE',
  'NO_FEE_PREFERENCE',
  'SHORT_TERM_PARKING',
  'GENERAL'
);

-- ----------------------------------------------------------------
-- Product
-- ----------------------------------------------------------------
CREATE TABLE "Product" (
  "id"                TEXT            NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "institution"       TEXT            NOT NULL,
  "productName"       TEXT            NOT NULL,
  "productType"       "ProductType"   NOT NULL,
  "category"          TEXT            NOT NULL,
  "eligibilityRules"  TEXT,
  "minDeposit"        NUMERIC(15, 2),
  "minIncome"         NUMERIC(15, 2),
  "maxBalance"        NUMERIC(15, 2),
  "accessType"        "AccessType"    NOT NULL,
  "noticePeriodDays"  INTEGER,
  "monthlyFee"        NUMERIC(10, 2)  NOT NULL DEFAULT 0,
  "initiationFee"     NUMERIC(10, 2)  NOT NULL DEFAULT 0,
  "withdrawalFee"     NUMERIC(10, 2)  NOT NULL DEFAULT 0,
  "adminFee"          NUMERIC(10, 2)  NOT NULL DEFAULT 0,
  "taxStatus"         "TaxStatus"     NOT NULL,
  "sourceUrl"         TEXT            NOT NULL,
  "lastCheckedDate"   TIMESTAMPTZ     NOT NULL,
  "updateFrequency"   TEXT            NOT NULL DEFAULT 'MONTHLY',
  "isActive"          BOOLEAN         NOT NULL DEFAULT TRUE,
  "notes"             TEXT,
  "createdAt"         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  "updatedAt"         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Product_productType_idx"  ON "Product" ("productType");
CREATE INDEX "Product_institution_idx"  ON "Product" ("institution");

-- ----------------------------------------------------------------
-- ProductRate
-- ----------------------------------------------------------------
CREATE TABLE "ProductRate" (
  "id"                TEXT            NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "productId"         TEXT            NOT NULL,
  "minBalance"        NUMERIC(15, 2)  NOT NULL DEFAULT 0,
  "maxBalance"        NUMERIC(15, 2),
  "interestRate"      NUMERIC(6, 4)   NOT NULL,
  "rateType"          "RateType"      NOT NULL DEFAULT 'NOMINAL',
  "effectiveYield"    NUMERIC(6, 4),
  "isPromotional"     BOOLEAN         NOT NULL DEFAULT FALSE,
  "promotionEndDate"  TIMESTAMPTZ,
  "createdAt"         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  "updatedAt"         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT "ProductRate_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProductRate_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE
);

CREATE INDEX "ProductRate_productId_idx" ON "ProductRate" ("productId");

-- ----------------------------------------------------------------
-- Calculator
-- ----------------------------------------------------------------
CREATE TABLE "Calculator" (
  "id"           TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"         TEXT        NOT NULL,
  "description"  TEXT        NOT NULL,
  "category"     TEXT        NOT NULL,
  "inputs"       JSONB       NOT NULL,
  "formula"      TEXT        NOT NULL,
  "outputFields" JSONB       NOT NULL,
  "taxYear"      TEXT,
  "assumptions"  JSONB,
  "sourceRefs"   JSONB,
  "isActive"     BOOLEAN     NOT NULL DEFAULT TRUE,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "Calculator_pkey"    PRIMARY KEY ("id"),
  CONSTRAINT "Calculator_name_key" UNIQUE ("name")
);

-- ----------------------------------------------------------------
-- ComparisonScore
-- ----------------------------------------------------------------
CREATE TABLE "ComparisonScore" (
  "id"              TEXT           NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "productId"       TEXT           NOT NULL,
  "userProfile"     "UserProfile"  NOT NULL,
  "rateScore"       NUMERIC(5, 2)  NOT NULL,
  "feeScore"        NUMERIC(5, 2)  NOT NULL,
  "accessScore"     NUMERIC(5, 2)  NOT NULL,
  "minBalanceScore" NUMERIC(5, 2)  NOT NULL,
  "tfsaScore"       NUMERIC(5, 2)  NOT NULL,
  "digitalScore"    NUMERIC(5, 2)  NOT NULL,
  "overallScore"    NUMERIC(5, 2)  NOT NULL,
  "effectiveReturn" NUMERIC(6, 4)  NOT NULL,
  "lastCalculated"  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  "createdAt"       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

  CONSTRAINT "ComparisonScore_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ComparisonScore_productId_userProfile_key"
    UNIQUE ("productId", "userProfile"),
  CONSTRAINT "ComparisonScore_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE
);

CREATE INDEX "ComparisonScore_userProfile_overallScore_idx"
  ON "ComparisonScore" ("userProfile", "overallScore");

-- ----------------------------------------------------------------
-- DataSource
-- ----------------------------------------------------------------
CREATE TABLE "DataSource" (
  "id"               TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"             TEXT        NOT NULL,
  "description"      TEXT        NOT NULL,
  "apiEndpoint"      TEXT,
  "refreshSchedule"  TEXT        NOT NULL,
  "lastSyncAt"       TIMESTAMPTZ,
  "lastSyncStatus"   TEXT,
  "lastSyncMessage"  TEXT,
  "isActive"         BOOLEAN     NOT NULL DEFAULT TRUE,
  "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "DataSource_pkey"     PRIMARY KEY ("id"),
  CONSTRAINT "DataSource_name_key" UNIQUE ("name")
);

-- ----------------------------------------------------------------
-- Trigger: auto-update updatedAt columns
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "Product_updatedAt"
  BEFORE UPDATE ON "Product"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "ProductRate_updatedAt"
  BEFORE UPDATE ON "ProductRate"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "Calculator_updatedAt"
  BEFORE UPDATE ON "Calculator"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "ComparisonScore_updatedAt"
  BEFORE UPDATE ON "ComparisonScore"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "DataSource_updatedAt"
  BEFORE UPDATE ON "DataSource"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

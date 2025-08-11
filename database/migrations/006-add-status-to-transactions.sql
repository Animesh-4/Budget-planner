-- Migration: 006-add-status-to-transactions.sql
-- Description: Adds a status column to the transactions table for soft deletes.

BEGIN;

-- Define a new type for the transaction status, only if it doesn't already exist.
DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('active', 'deleted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add the new status column to the transactions table, only if it doesn't already exist.
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS status transaction_status NOT NULL DEFAULT 'active';

-- Add an index on the new status column for efficient querying
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

COMMIT;

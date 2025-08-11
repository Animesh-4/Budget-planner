-- Migration: 003-create-transactions.sql
-- Description: Creates the transactions table to log income and expenses.

BEGIN;

CREATE SEQUENCE IF NOT EXISTS transactions_id_seq;

-- Define a custom type for transaction types, only if it doesn't already exist.
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('income', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('transactions_id_seq'),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE SET NULL,
    type transaction_type NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_budget_id ON transactions(budget_id);

COMMIT;

-- Migration: 002-create-budgets.sql
-- Description: Creates the budgets table to store user-defined budgets.

BEGIN;

CREATE SEQUENCE IF NOT EXISTS budgets_id_seq;

CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('budgets_id_seq'),
    
    -- Foreign key linking to the user who owns this budget
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Name of the budget (e.g., "Monthly Groceries", "Vacation Fund")
    name VARCHAR(100) NOT NULL,
    
    -- The total allocated amount for the budget
    amount NUMERIC(12, 2) NOT NULL,
    
    -- Timestamps for creation and updates
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add an index on user_id for efficient querying of a user's budgets
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);

COMMIT;

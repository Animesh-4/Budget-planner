-- Migration: 005-create-budget-users.sql
-- Description: Creates the budget_users join table for collaboration.

BEGIN;

-- Define a custom type for user roles, only if it doesn't already exist.
DO $$ BEGIN
    CREATE TYPE budget_role AS ENUM ('owner', 'editor', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS budget_users (
    budget_id INTEGER NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role budget_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (budget_id, user_id)
);

-- Add indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_budget_users_budget_id ON budget_users(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_users_user_id ON budget_users(user_id);

COMMIT;

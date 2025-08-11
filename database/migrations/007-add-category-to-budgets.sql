-- Migration: 007-add-category-to-budgets.sql
-- Description: Adds a category column to the budgets table.

BEGIN;

-- Add the new category column to the budgets table, only if it doesn't already exist.
ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS category VARCHAR(50);

COMMIT;

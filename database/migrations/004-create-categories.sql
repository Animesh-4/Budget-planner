-- Migration: 004-create-categories.sql
-- Description: Creates a categories table and links it to transactions.

BEGIN;

CREATE SEQUENCE IF NOT EXISTS categories_id_seq;

-- Create the categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('categories_id_seq'),
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Add the category_id column to the transactions table, only if it doesn't already exist
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

-- Add an index on the new category_id column
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);

COMMIT;

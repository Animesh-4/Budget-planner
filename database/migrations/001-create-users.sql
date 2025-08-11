-- Migration: 001-create-users.sql
-- Description: Creates the users table to store user information.

-- Use a transaction to ensure atomicity
BEGIN;

-- Create a sequence for user IDs to ensure they are unique and auto-incrementing
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    -- Primary key for the table, using the sequence for default values
    id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('users_id_seq'),
    
    -- User's chosen name, must be unique
    username VARCHAR(50) UNIQUE NOT NULL,
    
    -- User's email address, must be unique and is used for login
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- Hashed password for security
    password_hash VARCHAR(255) NOT NULL,
    
    -- Timestamps for tracking when the user was created and last updated
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add an index on the email column for faster lookups during login
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Commit the transaction
COMMIT;

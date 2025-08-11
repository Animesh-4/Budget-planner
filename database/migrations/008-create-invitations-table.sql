-- Migration: 008-create-invitations-table.sql
-- Description: Creates a table to store pending budget invitations.

BEGIN;

CREATE SEQUENCE IF NOT EXISTS invitations_id_seq;

-- Define a status for invitations
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE IF NOT EXISTS invitations (
    id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('invitations_id_seq'),
    
    -- Foreign key to the budget being shared
    budget_id INTEGER NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    
    -- Foreign key to the user who sent the invitation
    inviter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- The email of the person being invited
    invitee_email VARCHAR(255) NOT NULL,
    
    -- The role to be assigned upon acceptance
    role budget_role NOT NULL,
    
    -- A unique token for the invitation link
    token VARCHAR(255) UNIQUE NOT NULL,
    
    -- The current status of the invitation
    status invitation_status NOT NULL DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days'
);

-- Add indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_invitee_email ON invitations(invitee_email);

COMMIT;

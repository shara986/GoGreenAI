-- ============================================================
-- GoGreen AI - Database Initialization Script
-- Database: MySQL 8.x
-- ============================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS gogreen_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gogreen_db;

-- NOTE: Tables are created automatically by Spring Boot JPA (ddl-auto=update)
-- This script only creates the DB and initial admin/owner users.
-- Run this script ONCE before starting the application for the first time.

-- ============================================================
-- AFTER first app startup, insert seed data manually or
-- use the /auth/register API endpoint.
-- ============================================================

-- Example: Create admin user via SQL (password: Admin@1234)
-- BCrypt hash for "Admin@1234" (cost 10)
-- You can generate a fresh hash at: https://bcrypt-generator.com
INSERT IGNORE INTO users (id, name, username, email, password, phone_number, role, enabled, created_at, updated_at)
VALUES (
    UUID(),
    'System Admin',
    'admin',
    'admin@gogreen.com',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8tNeQ3pEKqmS.YM2aq',  -- Admin@1234
    NULL,
    'ROLE_ADMIN',
    TRUE,
    NOW(),
    NOW()
);

-- Example: Create nursery owner (password: Owner@1234)
-- BCrypt hash for "Owner@1234"
INSERT IGNORE INTO users (id, name, username, email, password, phone_number, role, enabled, created_at, updated_at)
VALUES (
    UUID(),
    'Nursery Owner',
    'nursery_owner',
    'owner@gogreen.com',
    '$2a$10$KIHyEMb7uVSMTBNDGo3K2OJI3VNaQXY1c.uB.UKSbR5pjRijQ2hHu',  -- Owner@1234
    NULL,
    'ROLE_NURSERY_OWNER',
    TRUE,
    NOW(),
    NOW()
);

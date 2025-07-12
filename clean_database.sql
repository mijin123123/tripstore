-- Drop existing tables to ensure a clean slate.
-- The CASCADE option will also remove any dependent objects like foreign key constraints.
DROP TABLE IF EXISTS admin_notifications CASCADE;
DROP TABLE IF EXISTS admin_access_logs CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

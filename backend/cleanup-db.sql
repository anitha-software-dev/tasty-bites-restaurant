-- RUN THIS IN YOUR NEON SQL EDITOR
-- This script removes the duplicate PascalCase tables and keeps the lowercase snake_case ones.

-- 1. Drop the PascalCase tables (DUPLICATES)
DROP TABLE IF EXISTS "Addresses" CASCADE;
DROP TABLE IF EXISTS "CateringEnquiries" CASCADE;
DROP TABLE IF EXISTS "ContactMessages" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;
DROP TABLE IF EXISTS "Orders" CASCADE;
DROP TABLE IF EXISTS "MenuItems" CASCADE;
DROP TABLE IF EXISTS "Categories" CASCADE;
DROP TABLE IF EXISTS "Testimonials" CASCADE;
DROP TABLE IF EXISTS "FAQs" CASCADE;
DROP TABLE IF EXISTS "Reservations" CASCADE;

-- 2. Verify remaining tables
-- After running this, only these should remain:
-- addresses, catering_enquiries, contact_messages, users, orders, menu_items, categories, testimonials, faqs, reservations

-- Add category and manufacturer columns to product table
ALTER TABLE product 
ADD COLUMN category VARCHAR(50),
ADD COLUMN manufacturer VARCHAR(100);


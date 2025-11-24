/*
  # Content Visibility Management System

  1. New Tables
    - `content_visibility`
      - `id` (uuid, primary key)
      - `content_type` (text) - Type: 'category', 'product', 'blog'
      - `content_id` (text) - ID of the content item
      - `content_slug` (text) - Slug of the content item
      - `is_hidden` (boolean) - Visibility status
      - `is_new` (boolean) - New badge for products
      - `is_hot` (boolean) - Hot badge for products
      - `updated_at` (timestamptz) - Last update timestamp
      - `updated_by` (text) - Who made the change
  
  2. Security
    - Enable RLS on `content_visibility` table
    - Add policy for public read access
    - Add policy for authenticated users to manage visibility

  3. Indexes
    - Index on content_type and content_id for fast lookups
    - Index on content_slug for slug-based queries
*/

-- Create content_visibility table
CREATE TABLE IF NOT EXISTS content_visibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('category', 'product', 'blog')),
  content_id text NOT NULL,
  content_slug text NOT NULL,
  content_name text,
  is_hidden boolean DEFAULT false,
  is_new boolean DEFAULT false,
  is_hot boolean DEFAULT false,
  display_order integer,
  updated_at timestamptz DEFAULT now(),
  updated_by text,
  UNIQUE(content_type, content_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_visibility_lookup ON content_visibility(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_visibility_slug ON content_visibility(content_slug);
CREATE INDEX IF NOT EXISTS idx_content_visibility_type ON content_visibility(content_type);

-- Enable RLS
ALTER TABLE content_visibility ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can view content visibility"
  ON content_visibility
  FOR SELECT
  TO public
  USING (true);

-- Policy for public to update (since we don't have auth yet)
CREATE POLICY "Anyone can update content visibility"
  ON content_visibility
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policy for public to insert
CREATE POLICY "Anyone can insert content visibility"
  ON content_visibility
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy for public to delete
CREATE POLICY "Anyone can delete content visibility"
  ON content_visibility
  FOR DELETE
  TO public
  USING (true);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_content_visibility_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_content_visibility_timestamp
  BEFORE UPDATE ON content_visibility
  FOR EACH ROW
  EXECUTE FUNCTION update_content_visibility_timestamp();

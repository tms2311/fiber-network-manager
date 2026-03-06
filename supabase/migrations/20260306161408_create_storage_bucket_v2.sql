/*
  # Create Storage Bucket for Attachments

  ## Overview
  This migration creates a storage bucket for fiber box photo attachments
  and configures the necessary security policies.

  ## Storage Bucket
  - `attachments` - Public bucket for storing box photos

  ## Security
  - Authenticated users can upload files
  - Authenticated users can view all files
  - Authenticated users can delete files
*/

-- Create storage bucket for attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
  DROP POLICY IF EXISTS "Public can view files" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
END $$;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'attachments');

-- Allow public read access to files
CREATE POLICY "Public can view files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'attachments');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'attachments');
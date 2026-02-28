-- Run this in Supabase Dashboard → SQL Editor to create the product-images storage bucket
-- and set it to public so uploaded URLs work without auth

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anyone to upload (for admin panel use — tighten with RLS in production)
CREATE POLICY "Public product image uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Allow public read access to all product images
CREATE POLICY "Public product image reads" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Supabase Database Schema for E-Commerce

-- Users table is managed by Supabase Auth (auth.users), but we can add a profile table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  billing_address JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Protect profiles with RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Order Items table
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL, -- Corresponds to Sanity document ID
  product_slug TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  license_tier TEXT NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
-- order_items visibility derived from orders table
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = order_items.order_id AND public.orders.user_id = auth.uid())
);

-- Licenses table
CREATE TABLE public.licenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  license_key TEXT UNIQUE NOT NULL,
  license_tier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own licenses" ON public.licenses FOR SELECT USING (auth.uid() = user_id);

-- Wishlist table
CREATE TABLE public.wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own wishlist" ON public.wishlist USING (auth.uid() = user_id);

-- Downloads table
CREATE TABLE public.downloads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  license_id UUID REFERENCES public.licenses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ip_address TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own downloads" ON public.downloads FOR SELECT USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Supabase Storage Buckets & Security Policies
-- -----------------------------------------------------------------------------

-- Create a secure, private bucket for storing encrypted digital product assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-assets', 'product-assets', false);

-- Enable RLS for the storage.objects table (which holds the actual files)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Only Admins/Service Roles can INSERT (upload) new product assets
CREATE POLICY "Admins can upload product assets" 
ON storage.objects FOR INSERT 
TO service_role 
WITH CHECK (bucket_id = 'product-assets');

-- Policy 2: Users can ONLY SELECT (download) assets if they own a valid license for that specific product
-- The 'name' of the storage object should match the 'product_slug' from the order_items/licenses table.
CREATE POLICY "Users can download owned product assets" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'product-assets' 
  AND EXISTS (
    SELECT 1 FROM public.order_items oi
    JOIN public.orders o ON oi.order_id = o.id
    WHERE o.user_id = auth.uid() 
    AND o.status = 'completed'
    AND storage.objects.name LIKE oi.product_slug || '%'
  )
);

-- -----------------------------------------------------------------------------
-- Contact System Submissions
-- -----------------------------------------------------------------------------

CREATE TABLE public.contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  product_mentioned TEXT,
  message TEXT NOT NULL,
  attachment_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  admin_notes TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS policy: Anyone can insert (so non-logged in users can submit contact forms).
-- Only Admins/Service Roles can select or update (handled via Supabase Dashboard / explicit Admin routes)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact form" 
ON public.contact_submissions FOR INSERT 
TO public
WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- ADVANCED FEATURES: Dynamic Pricing & Coupons
-- -----------------------------------------------------------------------------

CREATE TABLE public.coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percentage NUMERIC(5,2) CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  max_uses INTEGER DEFAULT 100,
  uses INTEGER DEFAULT 0,
  product_id TEXT, -- If null, applies to entire cart
  expires_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (active = true);


-- -----------------------------------------------------------------------------
-- ADVANCED FEATURES: Verified Reviews & Ratings
-- -----------------------------------------------------------------------------

CREATE TABLE public.product_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  body TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved reviews" ON public.product_reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create their own reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own pending reviews" ON public.product_reviews FOR SELECT USING (auth.uid() = user_id AND status = 'pending');


-- -----------------------------------------------------------------------------
-- ADVANCED FEATURES: License Management & Team Seats
-- -----------------------------------------------------------------------------

CREATE TABLE public.license_seats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  license_id UUID REFERENCES public.licenses(id) ON DELETE CASCADE NOT NULL,
  assigned_email TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  device_fingerprint TEXT,
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(license_id, assigned_email)
);

ALTER TABLE public.license_seats ENABLE ROW LEVEL SECURITY;
-- Main license owner can manage seats
CREATE POLICY "License owners can manage seats" ON public.license_seats USING (
  EXISTS (SELECT 1 FROM public.licenses WHERE id = license_id AND user_id = auth.uid())
);


-- -----------------------------------------------------------------------------
-- ADVANCED FEATURES: Affiliate / Referral Program
-- -----------------------------------------------------------------------------

CREATE TABLE public.affiliate_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  earnings_balance NUMERIC(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.affiliate_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own affiliate profile" ON public.affiliate_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE public.referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  affiliate_id UUID REFERENCES public.affiliate_profiles(id) ON DELETE CASCADE NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id), -- Nullable if they just clicked, but we track on signup
  order_id UUID REFERENCES public.orders(id), -- Linked when they make a purchase
  commission_earned NUMERIC(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affiliates can view own referrals" ON public.referrals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.affiliate_profiles WHERE id = affiliate_id AND user_id = auth.uid())
);

-- -----------------------------------------------------------------------------
-- CHECKOUT INSERT & UPDATE POLICIES (Required for Client-Side order creation)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = order_id AND public.orders.user_id = auth.uid())
);

CREATE POLICY "Users can insert own licenses" ON public.licenses FOR INSERT WITH CHECK (auth.uid() = user_id);

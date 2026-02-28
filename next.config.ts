import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity CDN — product images, gallery, blog covers
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      // Supabase Storage — user avatars, order attachments
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // General fallbacks (Unsplash, Pexels, etc.)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
    // Allow SVGs and WebP from admin CDN
    formats: ['image/avif', 'image/webp'],
  },
  // Silence the "Using `<img>` instead of `<Image>`" warning during migration
  // Set to true only to suppress; remove once you've migrated all <img> tags
  // eslint:disable-next-line
};

export default nextConfig;

import { NextResponse } from 'next/server';

// Public blog posts endpoint — fetches from Sanity CMS, no write token needed
export async function GET() {
    try {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

        if (!projectId || projectId === 'your-project-id') {
            return NextResponse.json({ posts: [] });
        }

        const query = encodeURIComponent(
            `*[_type == "post" && status != "draft"] | order(publishedAt desc, _createdAt desc) {
                _id,
                title,
                "slug": slug.current,
                category,
                excerpt,
                body,
                readTime,
                publishedAt,
                _createdAt,
                "coverImage": mainImage.asset->url,
                coverImageUrl,
                links,
                author
            }`
        );

        const res = await fetch(
            `https://${projectId}.api.sanity.io/v2021-03-25/data/query/${dataset}?query=${query}`,
            {
                headers: { 'Cache-Control': 'no-store' },
                cache: 'no-store',
            }
        );

        if (!res.ok) {
            return NextResponse.json({ posts: [] });
        }

        const data = await res.json();
        return NextResponse.json({ posts: data.result || [] });
    } catch (err: any) {
        return NextResponse.json({ posts: [], error: err.message });
    }
}

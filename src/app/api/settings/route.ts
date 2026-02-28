import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

        if (!projectId || projectId === 'your-project-id') {
            return NextResponse.json({ bannerActive: false, bannerText: '' });
        }

        const query = encodeURIComponent(`*[_type == "siteSettings"][0]`);
        const res = await fetch(
            `https://${projectId}.api.sanity.io/v2021-03-25/data/query/${dataset}?query=${query}`,
            { headers: { 'Cache-Control': 'no-store' }, cache: 'no-store' }
        );

        if (!res.ok) {
            return NextResponse.json({ bannerActive: false, bannerText: '' });
        }

        const data = await res.json();
        return NextResponse.json(data.result || { bannerActive: false, bannerText: '' });
    } catch (err: any) {
        return NextResponse.json({ bannerActive: false, bannerText: '', error: err.message });
    }
}

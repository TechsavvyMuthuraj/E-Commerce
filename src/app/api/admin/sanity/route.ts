import { NextResponse } from 'next/server';

const SANITY_URL = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-03-25/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}`;
const TOKEN = process.env.SANITY_API_TOKEN!;

// GET all documents of a type
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'post';
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

        // Return full fields so the edit form can be pre-filled
        const productFields = `_id, _type, title, slug, category, _createdAt, shortDescription, longDescription, features, pricingTiers[] { name, price, licenseType, downloadLink, paymentLink }, "mainImage": { "url": mainImage.asset->url, "ref": mainImage.asset._ref }, "gallery": gallery[] { "url": asset->url, "ref": asset._ref }`;
        const postFields = `_id, _type, title, slug, category, _createdAt, excerpt, body, readTime, coverImageUrl, links, author`;
        const fields = type === 'product' ? productFields : postFields;

        const query = encodeURIComponent(`*[_type == "${type}"] | order(_createdAt desc) { ${fields} }`);
        const res = await fetch(
            `https://${projectId}.api.sanity.io/v2021-03-25/data/query/${dataset}?query=${query}`,
            { headers: { Authorization: `Bearer ${TOKEN}` }, cache: 'no-store' }
        );
        const data = await res.json();
        return NextResponse.json({ documents: data.result || [] });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST: Create a new document
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { document } = body;

        const res = await fetch(SANITY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify({
                mutations: [{ create: document }],
            }),
        });

        const data = await res.json();
        if (!res.ok) return NextResponse.json({ error: data }, { status: 500 });
        return NextResponse.json({ success: true, result: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PATCH: Update a document
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, patch } = body;

        const res = await fetch(SANITY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify({
                mutations: [{ patch: { id, set: patch } }],
            }),
        });

        const data = await res.json();
        if (!res.ok) return NextResponse.json({ error: data }, { status: 500 });
        return NextResponse.json({ success: true, result: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE a document
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        const res = await fetch(SANITY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify({
                mutations: [{ delete: { id } }],
            }),
        });

        const data = await res.json();
        if (!res.ok) return NextResponse.json({ error: data }, { status: 500 });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

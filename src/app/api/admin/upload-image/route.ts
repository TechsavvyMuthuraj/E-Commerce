import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Upload image — tries Sanity first, falls back to Supabase Storage
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
        const token = process.env.SANITY_API_TOKEN;

        // ── 1. Try Sanity upload ────────────────────────────────────────────
        if (projectId && token && projectId !== 'your-project-id') {
            const buffer = Buffer.from(await file.arrayBuffer());

            const sanityRes = await fetch(
                `https://${projectId}.api.sanity.io/v2021-03-25/assets/images/${dataset}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': file.type || 'image/jpeg',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: buffer,
                }
            );

            const raw = await sanityRes.text();

            if (sanityRes.ok) {
                try {
                    const sanityData = JSON.parse(raw);
                    // Sanity returns the asset directly (not nested under .document)
                    const asset = sanityData.document ?? sanityData;
                    if (asset?._id) {
                        const cdnUrl = asset.url
                            ? asset.url.replace('cdn.sanity.io', 'cdn.sanity.io')
                            : `https://cdn.sanity.io/images/${projectId}/${dataset}/${asset._id.replace('image-', '').replace(/-(\w+)$/, '.$1')}`;
                        return NextResponse.json({
                            assetId: asset._id,
                            url: cdnUrl,
                            source: 'sanity',
                        });
                    }
                } catch (_) {
                    // JSON parse error — fall through to Supabase
                }
            }

            // Token may lack write permissions — log detail and fall through
            console.warn('[upload-image] Sanity upload failed, falling back to Supabase. Status:', sanityRes.status, 'Body:', raw.slice(0, 300));
        }

        // ── 2. Fallback: Supabase Storage ───────────────────────────────────
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const { data: storageData, error: storageError } = await supabase.storage
            .from('product-images')
            .upload(fileName, uint8Array, {
                contentType: file.type || 'image/jpeg',
                upsert: false,
            });

        if (storageError) {
            // If bucket doesn't exist yet, return a helpful error
            return NextResponse.json({
                error: 'Upload failed on both Sanity and Supabase Storage.',
                sanityNote: 'Check that SANITY_API_TOKEN has Editor permissions in Sanity → Manage → API → Tokens.',
                supabaseNote: storageError.message + ' — Create a "product-images" storage bucket in Supabase Dashboard → Storage.',
            }, { status: 500 });
        }

        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(storageData.path);

        return NextResponse.json({
            assetId: storageData.path,
            url: urlData.publicUrl,
            source: 'supabase',
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

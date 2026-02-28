import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// Use service role key if available for admin tasks to bypass RLS
// For this app, we are assuming the ANON KEY has full access or we have an admin system in place
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

export async function GET() {
    try {
        // Fetch licenses with user email and product details (we'll fetch orders to get emails)
        // Since we may not have direct foreign keys to auth.users in the anon client, we will fetch licenses
        const { data: licenses, error } = await supabase
            .from('licenses')
            .select(`
                id,
                user_id,
                product_id,
                order_id,
                license_key,
                license_tier,
                created_at,
                status
            `)
            .order('created_at', { ascending: false });

        if (error) {
            // fallback if status column doesn't exist
            if (error.code === 'PGRST200') {
                const { data: fallbackLicenses, error: err2 } = await supabase
                    .from('licenses')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (err2) throw err2;
                return NextResponse.json({ success: true, licenses: fallbackLicenses });
            }
            throw error;
        }

        return NextResponse.json({ success: true, licenses });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId, productId, tier } = await req.json();

        // Generate a custom key
        const newKey = `EXE-${productId.substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        const payload: any = {
            user_id: userId || 'manual-admin-gen',
            product_id: productId,
            order_id: 'manual',
            license_key: newKey,
            license_tier: tier || 'tier1'
        };

        const { data, error } = await supabase.from('licenses').insert([payload]).select().single();
        if (error) throw error;

        // Log action
        const ip_address = req.headers.get('x-forwarded-for') || '127.0.0.1';
        await supabase.from('admin_logs').insert([{ action_type: 'LICENSE_CREATE', description: `Manually generated ${tier} key for product ${productId}`, ip_address }]);

        return NextResponse.json({ success: true, license: data });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    // We will use DELETE as hard revoke
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) throw new Error("Missing ID");

        // Alternatively we could UPDATE status = 'revoked', but since we aren't sure the column exists, DELETE is safe.
        const { error } = await supabase.from('licenses').delete().eq('id', id);
        if (error) throw error;

        // Log action
        const ip_address = req.headers.get('x-forwarded-for') || '127.0.0.1';
        await supabase.from('admin_logs').insert([{ action_type: 'LICENSE_REVOKE', description: `Permanently revoked license key (ID: ${id})`, ip_address }]);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

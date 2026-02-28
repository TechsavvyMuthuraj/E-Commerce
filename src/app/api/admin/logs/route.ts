import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

export async function GET() {
    try {
        const { data: logs, error } = await supabase
            .from('admin_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            // Graceful fallback if table doesn't exist yet
            if (error.code === '42P01') {
                return NextResponse.json({ success: true, logs: [] });
            }
            throw error;
        }

        return NextResponse.json({ success: true, logs });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { action_type, description } = await req.json();

        // Use standard forwarding headers to mock IP if on Vercel
        const ip_address = req.headers.get('x-forwarded-for') || '127.0.0.1';

        const { error } = await supabase
            .from('admin_logs')
            .insert([{ action_type, description, ip_address }]);

        if (error) {
            // Graceful fallback
            if (error.code === '42P01') {
                console.warn('[Audit Log] admin_logs table missing, skipping insert.');
                return NextResponse.json({ success: true, warning: 'Table missing' });
            }
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

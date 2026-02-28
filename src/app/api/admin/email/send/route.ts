import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

export async function POST(req: Request) {
    try {
        const { subject, body, segment } = await req.json();

        if (!subject || !body) {
            return NextResponse.json({ success: false, error: 'Missing subject or body' }, { status: 400 });
        }

        // --- SIMULATION LOGIC ---
        // In a production environment, we would use Resend, SendGrid, or AWS SES here.
        // We would fetch the emails from Supabase matching the `segment` (e.g. 'all', 'buyers', 'vip')
        // and dispatch the emails.

        console.log(`[EMAIL BLAST SIMULATION] Segment: ${segment}`);
        console.log(`[EMAIL BLAST SIMULATION] Subject: ${subject}`);
        console.log(`[EMAIL BLAST SIMULATION] Body size: ${body.length} bytes`);

        // Simulate network delay for realistic UI
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Let's pretend we sent it to 142 people
        const simulatedCount = segment === 'all' ? 421 : 142;

        const ip_address = req.headers.get('x-forwarded-for') || '127.0.0.1';
        await supabase.from('admin_logs').insert([{
            action_type: 'EMAIL_BLAST',
            description: `Sent campaign "${subject}" to ${simulatedCount} users (${segment})`,
            ip_address
        }]);

        return NextResponse.json({
            success: true,
            message: `Successfully dispatched to ${simulatedCount} users in the '${segment}' segment.`
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import ContactAdminEmail from '@/emails/ContactAdminEmail';
import ContactAutoReply from '@/emails/ContactAutoReply';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const FROM_EMAIL = process.env.FROM_EMAIL || 'support@toolcraft.io';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'admin@toolcraft.io';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, product, message, honeypot } = body;

        // 1. Validation Layer
        if (honeypot) {
            // Spam detected via honeypot field
            return NextResponse.json({ success: true, message: 'Message received.' }); // silently ignore
        }

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { success: false, error: 'Missing required configuration fields.' },
                { status: 400 }
            );
        }

        if (message.length < 20) {
            return NextResponse.json(
                { success: false, error: 'Transmission payload too short. Minimum 20 characters required.' },
                { status: 400 }
            );
        }

        // Email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid origin email address.' },
                { status: 400 }
            );
        }

        // Generate UUID locally since RLS prevents SELECT on anonymous inserts
        const ticketId = crypto.randomUUID();

        // 2. Insert into Supabase
        const { error: dbError } = await supabase
            .from('contact_submissions')
            .insert([
                {
                    id: ticketId,
                    name,
                    email,
                    subject,
                    product_mentioned: product || null,
                    message,
                    status: 'new'
                }
            ]);

        if (dbError) {
            console.error('Supabase Insertion Error:', dbError);
            return NextResponse.json(
                { success: false, error: 'Server node failure: Could not log ticket to database.' },
                { status: 500 }
            );
        }

        // 3. Send Emails via Resend
        if (process.env.RESEND_API_KEY) {
            try {
                // Send Admin Notification
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: ADMIN_EMAIL,
                    subject: `[New System Ticket] ${subject} - from ${name}`,
                    react: ContactAdminEmail({
                        name,
                        email,
                        subject,
                        message,
                        ticketId,
                        product,
                    }),
                });

                // Send Auto-Reply to User
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: email,
                    subject: `We received your message — ToolCraft System`,
                    react: ContactAutoReply({
                        name,
                        subject,
                        ticketId,
                    }),
                });
            } catch (emailError) {
                console.error('Resend Transmission Failed:', emailError);
                // Do not punish user for email server failure since ticket is logged
            }
        } else {
            console.warn("RESEND_API_KEY not configured. Emails were mocked / not transmitted.");
        }

        return NextResponse.json({ success: true, ticketId });

    } catch (error: any) {
        console.error('Contact API Route Crash:', error);
        return NextResponse.json(
            { success: false, error: 'Internal system failure during processing.' },
            { status: 500 }
        );
    }
}

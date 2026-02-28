import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            cartItems,
            accessToken,
            userId,
            amount,
            isCustomOrder,
            label
        } = await request.json();

        // ── STEP 1: Verify Razorpay Signature (critical — must pass) ────────
        const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
        }

        // ── STEP 1.5: Special Case for Custom Orders ────────────────────────
        if (isCustomOrder) {
            return NextResponse.json({
                success: true,
                orderId: `CUSTOM-${razorpay_payment_id}`,
                message: 'Custom payment verified successfully',
                label: label || 'Custom Order'
            });
        }

        // ── STEP 2: Generate license keys for each cart item ─────────────────
        const licenseKeys: Record<string, string> = {};
        (cartItems || []).forEach((item: any) => {
            licenseKeys[item.slug || item.productId || item.id] =
                `KEY-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        });

        // ── STEP 3: Build download links ─────────────────────────────────────
        const downloadLinks = (cartItems || [])
            .map((item: any) => ({
                title: item.title || item.name || 'Product',
                slug: item.slug,
                downloadLink: item.downloadLink || null,
                licenseKey: licenseKeys[item.slug || item.productId || item.id],
            }))
            .filter((d: any) => d.downloadLink);

        // ── STEP 4: Save order to Supabase (optional — don't fail if missing) ─
        let orderId = `RP-${razorpay_payment_id}`;
        const dbErrors: string[] = [];

        try {
            if (supabaseUrl && supabaseAnonKey && accessToken && userId) {
                const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                    global: { headers: { Authorization: `Bearer ${accessToken}` } }
                });

                // Insert order
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .insert({
                        user_id: userId,
                        amount,
                        razorpay_order_id,
                        razorpay_payment_id,
                        status: 'completed'
                    })
                    .select()
                    .single();

                if (orderError) {
                    dbErrors.push('orders: ' + orderError.message);
                } else {
                    orderId = orderData.id;

                    // Insert order items
                    const orderItemsPayload = (cartItems || []).map((item: any) => ({
                        order_id: orderId,
                        product_id: item.productId,
                        product_slug: item.slug,
                        price: item.price,
                        license_tier: item.licenseTier
                    }));
                    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
                    if (itemsError) dbErrors.push('order_items: ' + itemsError.message);

                    // Insert licenses
                    const licensesPayload = (cartItems || []).map((item: any) => ({
                        user_id: userId,
                        product_id: item.productId,
                        order_id: orderId,
                        license_key: licenseKeys[item.slug || item.productId || item.id],
                        license_tier: item.licenseTier
                    }));
                    const { error: licensesError } = await supabase.from('licenses').insert(licensesPayload);
                    if (licensesError) dbErrors.push('licenses: ' + licensesError.message);
                }
            } else {
                dbErrors.push('Supabase credentials or session missing — order not saved to DB');
            }
        } catch (dbErr: any) {
            // DB save failed — log but do NOT block the customer's download
            dbErrors.push('DB exception: ' + dbErr.message);
        }

        if (dbErrors.length > 0) {
            console.warn('[verify-payment] DB write issues (payment still valid):', dbErrors);
        }

        // ── STEP 5: Always return success if signature was valid ──────────────
        return NextResponse.json({
            success: true,
            orderId,
            downloadLinks,
            primaryDownload: downloadLinks[0]?.downloadLink || null,
            ...(dbErrors.length > 0 ? { dbWarnings: dbErrors } : {})
        });

    } catch (err: any) {
        console.error('[verify-payment] Fatal error:', err);
        return NextResponse.json({ success: false, error: err.message || 'Verification failed' }, { status: 500 });
    }
}

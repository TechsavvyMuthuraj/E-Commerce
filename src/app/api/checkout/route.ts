import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabase } from '@/lib/supabase';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export async function POST(request: Request) {
    try {
        const { items, couponCode } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
        }

        // 1. Calculate base amount securely from item prices (in a real app, query Sanity/DB for real prices)
        let finalAmount = items.reduce((total: number, item: any) => total + item.price, 0);

        // 2. Validate Coupon & Apply Discount Server-Side
        if (couponCode) {
            const { data: coupon, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', couponCode.toUpperCase())
                .single();

            if (!error && coupon && coupon.active && coupon.uses < coupon.max_uses) {
                // Ensure valid expiration
                if (!coupon.expires_at || new Date(coupon.expires_at) >= new Date()) {
                    // Scope check for product specific coupons
                    const appliesToCart = coupon.product_id
                        ? items.some((item: any) => item.productId === coupon.product_id)
                        : true;

                    if (appliesToCart) {
                        const discount = finalAmount * (coupon.discount_percentage / 100);
                        finalAmount = Math.max(0, finalAmount - discount);
                    }
                }
            }
        }

        // Amount must be in the smallest currency unit
        const amountInSmallestUnit = Math.round(finalAmount * 100);

        const options = {
            amount: amountInSmallestUnit,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1, // Auto-capture payments
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({ order }, { status: 200 });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { error: 'Failed to initialize payment gateway' },
            { status: 500 }
        );
    }
}

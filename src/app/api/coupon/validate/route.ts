import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { code, cartItems } = await request.json();

        if (!code || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
        }

        const { data: coupon, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();

        if (error || !coupon) {
            return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 404 });
        }

        if (!coupon.active) {
            return NextResponse.json({ success: false, error: 'Coupon is no longer active' }, { status: 400 });
        }

        if (coupon.uses >= coupon.max_uses) {
            return NextResponse.json({ success: false, error: 'Coupon usage limit reached' }, { status: 400 });
        }

        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
            return NextResponse.json({ success: false, error: 'Coupon has expired' }, { status: 400 });
        }

        // Product specific coupon check
        if (coupon.product_id) {
            const hasProduct = cartItems.some((item: any) => item.productId === coupon.product_id);
            if (!hasProduct) {
                return NextResponse.json({ success: false, error: 'Coupon does not apply to items in cart' }, { status: 400 });
            }
        }

        return NextResponse.json({
            success: true,
            discountPercentage: coupon.discount_percentage,
            code: coupon.code
        });

    } catch (err) {
        console.error('Coupon validation error:', err);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}

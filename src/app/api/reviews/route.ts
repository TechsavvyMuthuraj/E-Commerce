import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const { rating, title, body, productId, accessToken, userId } = await request.json();

        if (!userId || !accessToken) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
        }
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ success: false, error: 'Invalid rating' }, { status: 400 });
        }
        if (!productId) {
            return NextResponse.json({ success: false, error: 'Missing product' }, { status: 400 });
        }

        // 1. Initialize Supabase Auth Context
        const userClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
        );

        // 2. Verify Purchase
        const { data: purchaseData, error: purchaseError } = await userClient
            .from('licenses')
            .select('id')
            .eq('product_id', productId)
            .eq('user_id', userId)
            .limit(1);

        if (purchaseError) {
            console.error('Check purchase error:', purchaseError);
            return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
        }

        const isVerifiedPurchase = purchaseData && purchaseData.length > 0;

        if (!isVerifiedPurchase) {
            return NextResponse.json({ success: false, error: 'Only verified buyers can leave a review.' }, { status: 403 });
        }

        // 3. Insert Review
        const { error: insertError } = await userClient
            .from('product_reviews')
            .insert({
                product_id: productId,
                user_id: userId,
                rating,
                title: title || '',
                body: body || '',
                is_verified_purchase: true,
                status: 'approved' // Automatically auto-approve for Demo purposes
            });

        if (insertError) {
            console.error('Insert review error:', insertError);
            return NextResponse.json({ success: false, error: 'Failed to save review' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

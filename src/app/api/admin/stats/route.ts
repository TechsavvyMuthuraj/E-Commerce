import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Stats endpoint for admin dashboard
export async function GET() {
    try {
        const [orders, reviews, coupons] = await Promise.all([
            supabase.from('orders').select('id, amount, status, created_at').order('created_at', { ascending: false }).limit(10),
            supabase.from('product_reviews').select('id, product_id, rating, title, status, created_at').order('created_at', { ascending: false }).limit(20),
            supabase.from('coupons').select('*').order('created_at', { ascending: false }),
        ]);

        const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        const { count: pendingReviews } = await supabase.from('product_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending');
        const { count: totalUsers } = await supabase.from('licenses').select('user_id', { count: 'exact', head: true });

        const totalRevenue = orders.data?.reduce((sum, o) => sum + (o.status === 'completed' ? o.amount : 0), 0) || 0;

        return NextResponse.json({
            stats: { totalOrders, pendingReviews, totalUsers, totalRevenue },
            recentOrders: orders.data || [],
            reviews: reviews.data || [],
            coupons: coupons.data || [],
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

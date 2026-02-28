import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Stats endpoint for admin dashboard
export async function GET() {
    try {
        const [orders, reviews, coupons, allOrders] = await Promise.all([
            supabase.from('orders').select('id, amount, status, created_at').order('created_at', { ascending: false }).limit(10),
            supabase.from('product_reviews').select('id, product_id, rating, title, status, created_at').order('created_at', { ascending: false }).limit(20),
            supabase.from('coupons').select('*').order('created_at', { ascending: false }),
            supabase.from('orders').select('amount, status, created_at').eq('status', 'completed') // For chart
        ]);

        const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        const { count: pendingReviews } = await supabase.from('product_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending');
        const { count: totalUsers } = await supabase.from('licenses').select('user_id', { count: 'exact', head: true });

        const totalRevenue = orders.data?.reduce((sum, o) => sum + (o.status === 'completed' ? o.amount : 0), 0) || 0;

        // Generate 30-day timeline for chart
        const dailyRevenue: Record<string, number> = {};
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dailyRevenue[d.toISOString().split('T')[0]] = 0;
        }

        allOrders.data?.forEach(order => {
            const dateStr = order.created_at.split('T')[0];
            if (dailyRevenue[dateStr] !== undefined) {
                dailyRevenue[dateStr] += order.amount;
            }
        });

        const timeline = Object.entries(dailyRevenue).map(([date, value]) => ({ date, value }));

        return NextResponse.json({
            stats: { totalOrders, pendingReviews, totalUsers, totalRevenue },
            recentOrders: orders.data || [],
            reviews: reviews.data || [],
            coupons: coupons.data || [],
            timeline
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

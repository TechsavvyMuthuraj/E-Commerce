import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// PATCH: Approve or Reject a review
export async function PATCH(request: Request) {
    try {
        const { id, status } = await request.json();
        const { error } = await supabase.from('product_reviews').update({ status }).eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE: Remove a review
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        const { error } = await supabase.from('product_reviews').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

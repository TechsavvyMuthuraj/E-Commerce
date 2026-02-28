import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Use same env vars as main checkout
const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export async function POST(request: Request) {
    try {
        const { amount, label } = await request.json();

        if (!amount || Number(amount) <= 0) {
            return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
        }

        // Razorpay expects amount in smallest currency unit (paise for INR)
        const amountInSmallestUnit = Math.round(Number(amount) * 100);

        const options = {
            amount: amountInSmallestUnit,
            currency: 'INR',
            receipt: `custom_${Date.now()}`,
            notes: {
                label: label || 'Custom Order'
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({ order }, { status: 200 });
    } catch (error: any) {
        console.error('Custom checkout error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

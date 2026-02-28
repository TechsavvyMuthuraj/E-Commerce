import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export async function POST(request: Request) {
    try {
        const { amount } = await request.json();

        if (!amount) {
            return NextResponse.json(
                { error: 'Amount is required' },
                { status: 400 }
            );
        }

        // Amount must be in the smallest currency unit (e.g., paise for INR)
        // Since our app uses dollars natively on UI, we'll convert strictly for Razorpay (USD -> INR approximation roughly 83)
        // For demo purposes, we will treat the cart total as pure INR currency or multiply by 100 for smallest units.
        const amountInSmallestUnit = Math.round(amount * 100);

        const options = {
            amount: amountInSmallestUnit,
            currency: 'USD',
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

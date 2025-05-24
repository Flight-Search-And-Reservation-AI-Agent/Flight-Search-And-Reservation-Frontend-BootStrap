import React from 'react';
import axios from 'axios';

interface BookButtonProps {
    flightId: string;
    userId: string;
    amount: number; // in ₹
}

const BookButton: React.FC<BookButtonProps> = ({ flightId, userId, amount }) => {
    const handleBooking = async () => {
        try {
            // Step 1: Create Razorpay order from backend
            const res = await axios.post('/api/payment/order', { amount: amount * 100 }); // ₹ to paise
            const { orderId, currency } = res.data;

            // Step 2: Razorpay Checkout
            const options = {
                key: 'YOUR_KEY_ID',
                amount: amount * 100,
                currency,
                name: 'Flight Booking',
                description: 'Pay for flight reservation',
                order_id: orderId,
                handler: async (response: any) => {
                    // Step 3: Call backend to create reservation
                    await axios.post('/api/reservations', {
                        flightId,
                        userId,
                        status: 'CONFIRMED',
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                    });

                    alert('Booking successful!');
                },
                prefill: {
                    name: 'Test User',
                    email: 'test@example.com',
                },
                theme: {
                    color: '#0d6efd',
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err) {
            alert('Booking/payment failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <button className="rounded-pill px-4 btn btn-success" onClick={handleBooking}>
            Book Flight
        </button>
    );
};

export default BookButton;

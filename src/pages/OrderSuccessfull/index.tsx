// OrderSuccessPage.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import './index.css'; // We'll create this for custom animations

interface LocationState {
  orderId: string;
  totalAmount: number;
}

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, totalAmount } = location.state as LocationState;

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4169E1', '#8A2BE2']
    });
  }, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 md:p-12 max-w-lg w-full shadow-2xl relative overflow-hidden fade-in">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-8">
          <svg
            className="w-full h-full text-green-500 bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-4 slide-up">
          Order Successful!
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8 slide-up">
          Thank you for shopping with us!
        </p>

        {/* Order Details */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8 slide-up">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order ID:</span>
              <span className="text-blue-900 font-semibold">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Ammount:</span>
              <span className="text-blue-900 font-semibold">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Animated Candies */}
        <div className="candy-container">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="candy"
              style={{
                left: `${i * 10}%`,
                animationDelay: `${i * 0.3}s`,
                backgroundColor: ['#FFD700', '#FFA500', '#FF6B6B', '#4169E1', '#8A2BE2'][i % 5],
              }}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-blue-900 text-white py-4 rounded-xl font-semibold 
                   hover:bg-blue-800 transform hover:-translate-y-1 transition-all duration-200 
                   slide-up focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
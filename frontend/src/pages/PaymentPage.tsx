import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { showToast } from '../components/ui/Toaster';

const PaymentPage = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderComplete, setOrderComplete] = useState(false);
  const [processing, setProcessing] = useState(true);
  const [orderId] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);

  // Simulate payment processing
  useEffect(() => {
    const timer = setTimeout(() => {
      setProcessing(false);
      setOrderComplete(true);
      showToast('Payment successful! Your order has been placed.', 'success');
      clearCart();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  
  // Navigate to home after payment success
  const handleContinueShopping = () => {
    navigate('/');
  };

  if (processing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing your payment</h2>
          <p className="text-gray-600 mb-6">Please wait while we process your payment. Do not close this page.</p>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8"
      >
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600">Your order has been placed successfully.</p>
        
        <div className="my-8 text-left border-t border-b border-gray-200 py-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-500">Order Number:</span>
            <span className="font-bold">{orderId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-500">Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-500">Items:</span>
            <span>{items.length}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-8">
          We've sent a confirmation email to your email address. You can also track your order in your account dashboard.
        </p>
        
        <div className="flex flex-col space-y-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleContinueShopping}
            className="bg-blue-600 text-white font-medium py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </motion.button>
          <button
            onClick={() => navigate('/profile/orders')}
            className="text-blue-600 hover:text-blue-800 font-medium py-2"
          >
            View Order Details
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;
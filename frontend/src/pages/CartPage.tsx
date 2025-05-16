import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/ui/Toaster';
import { Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdatingCart(true);
    setTimeout(() => {
      updateQuantity(productId, newQuantity);
      setIsUpdatingCart(false);
    }, 300);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    showToast(`${productName} removed from cart`, 'info');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b border-gray-200">
              <div className="col-span-2 font-medium text-gray-700">Product</div>
              <div className="text-center font-medium text-gray-700">Price</div>
              <div className="text-center font-medium text-gray-700">Quantity</div>
              <div className="text-right font-medium text-gray-700">Total</div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 items-center"
                >
                  {/* Product */}
                  <div className="md:col-span-2 flex items-center space-x-4">
                    <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/products/${item.id}`}
                        className="text-blue-600 font-medium hover:text-blue-800 line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-center md:text-center">
                    <span className="md:hidden font-medium text-gray-500">Price: </span>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </div>
                  
                  {/* Quantity */}
                  <div className="flex items-center justify-center">
                    <span className="md:hidden font-medium text-gray-500 mr-2">Quantity: </span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x border-gray-300">
                        {isUpdatingCart ? '...' : item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Total & Remove */}
                  <div className="flex items-center justify-between md:justify-end">
                    <div>
                      <span className="md:hidden font-medium text-gray-500">Total: </span>
                      <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <button
                onClick={() => {
                  clearCart();
                  showToast('Cart cleared', 'info');
                }}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear Cart
              </button>
              <Link
                to="/products"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-20">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {totalPrice >= 50 ? 'Free' : '$5.99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${(totalPrice * 0.07).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">
                    ${(totalPrice + (totalPrice >= 50 ? 0 : 5.99) + totalPrice * 0.07).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className="w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium"
              >
                Proceed to Checkout
                <ArrowRight size={16} className="ml-2" />
              </motion.button>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <Truck size={16} className="text-gray-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                    <p className="text-xs text-gray-500">On orders over $50</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ShieldCheck size={16} className="text-gray-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Secure Checkout</p>
                    <p className="text-xs text-gray-500">We use encryption to keep your data safe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Truck, ChevronRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
}

const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivery in 3-5 business days',
    price: 5.99,
    estimatedDelivery: '3-5 business days',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivery in 1-2 business days',
    price: 14.99,
    estimatedDelivery: '1-2 business days',
  },
  {
    id: 'free',
    name: 'Free Shipping',
    description: 'Eligible for orders over $50',
    price: 0,
    estimatedDelivery: '5-7 business days',
  },
];

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [address, setAddress] = useState<Address>({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>(
    totalPrice >= 50 ? 'free' : 'standard'
  );
  
  const shippingCost = shippingMethods.find(m => m.id === selectedShippingMethod)?.price || 0;
  const taxAmount = totalPrice * 0.07;
  const orderTotal = totalPrice + shippingCost + taxAmount;
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleShippingMethodChange = (id: string) => {
    setSelectedShippingMethod(id);
  };
  
  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };
  
  const handleContinueToReview = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/payment');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Checkout steps */}
        <div className="mb-8">
          <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500">
            <li className="flex md:w-full items-center text-blue-600 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10">
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                Cart
              </span>
            </li>
            <li className={`flex md:w-full items-center ${step === 'shipping' ? 'text-blue-600' : 'text-gray-500'} after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}>
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                <span className="mr-2">
                  {step === 'payment' ? (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  ) : (
                    <div className="flex items-center justify-center w-5 h-5 mr-2 border border-blue-600 rounded-full">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </span>
                Shipping
              </span>
            </li>
            <li className={`flex items-center ${step === 'payment' ? 'text-blue-600' : 'text-gray-500'}`}>
              <span className="flex items-center">
                <div className={`flex items-center justify-center w-5 h-5 mr-2 border ${step === 'payment' ? 'border-blue-600' : 'border-gray-500'} rounded-full`}>
                  {step === 'payment' ? (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  ) : (
                    <span className="text-xs">3</span>
                  )}
                </div>
                Payment
              </span>
            </li>
          </ol>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {step === 'shipping' ? (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                      <Truck size={20} className="mr-2" />
                      Shipping Information
                    </h2>
                  </div>
                  
                  <form onSubmit={handleContinueToPayment} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                          Full name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={address.fullName}
                            onChange={handleAddressChange}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="addressLine1"
                            name="addressLine1"
                            value={address.addressLine1}
                            onChange={handleAddressChange}
                            required
                            placeholder="Street address or P.O. Box"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                          Apartment, suite, etc. (optional)
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="addressLine2"
                            name="addressLine2"
                            value={address.addressLine2}
                            onChange={handleAddressChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={address.city}
                            onChange={handleAddressChange}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          State / Province
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={address.state}
                            onChange={handleAddressChange}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                          Postal code
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={address.postalCode}
                            onChange={handleAddressChange}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <div className="mt-1">
                          <select
                            id="country"
                            name="country"
                            value={address.country}
                            onChange={handleAddressChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="Mexico">Mexico</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <div className="mt-1">
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={address.phone}
                            onChange={handleAddressChange}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Method</h3>
                      <div className="space-y-4">
                        {shippingMethods.map((method) => (
                          <div key={method.id}>
                            <label className={`
                              relative block cursor-pointer rounded-lg border bg-white p-4 focus:outline-none
                              ${selectedShippingMethod === method.id 
                                ? 'border-blue-500 ring-2 ring-blue-500' 
                                : 'border-gray-300'
                              }
                              ${method.id === 'free' && totalPrice < 50 ? 'opacity-50 cursor-not-allowed' : ''}
                            `}>
                              <input
                                type="radio"
                                name="shipping-method"
                                value={method.id}
                                checked={selectedShippingMethod === method.id}
                                onChange={() => handleShippingMethodChange(method.id)}
                                disabled={method.id === 'free' && totalPrice < 50}
                                className="sr-only"
                              />
                              <div className="flex items-start">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{method.name}</p>
                                  <div className="mt-1 flex items-center">
                                    <p className="text-sm text-gray-500">{method.description}</p>
                                    {method.id === 'free' && totalPrice < 50 && (
                                      <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                        Requires $50+ order
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">Estimated delivery: {method.estimatedDelivery}</p>
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                                </div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                      >
                        Continue to Payment
                        <ChevronRight size={16} className="ml-2" />
                      </motion.button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                      <CreditCard size={20} className="mr-2" />
                      Payment Method
                    </h2>
                  </div>
                  
                  <form onSubmit={handleContinueToReview} className="p-6 space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block relative rounded-lg border border-gray-300 bg-white p-4 focus:outline-none cursor-pointer">
                          <input
                            type="radio"
                            name="payment-method"
                            value="credit-card"
                            defaultChecked
                            className="sr-only"
                          />
                          <div className="flex items-center">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">Credit / Debit Card</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-8" />
                              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
                              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" className="h-8" />
                            </div>
                          </div>
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-3">
                          <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                            Card number
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="card-number"
                              placeholder="1234 1234 1234 1234"
                              required
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="col-span-2">
                          <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                            Expiration date (MM/YY)
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="expiration-date"
                              placeholder="MM/YY"
                              required
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                            CVC
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cvc"
                              placeholder="123"
                              required
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="col-span-3">
                          <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">
                            Name on card
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="name-on-card"
                              required
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="save-card"
                            name="save-card"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="save-card" className="font-medium text-gray-700">
                            Save this card for future purchases
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep('shipping')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Back to shipping
                      </button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                      >
                        Complete Order
                        <ChevronRight size={16} className="ml-2" />
                      </motion.button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-20">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="max-h-80 overflow-y-auto space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">${orderTotal.toFixed(2)}</span>
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

export default CheckoutPage;
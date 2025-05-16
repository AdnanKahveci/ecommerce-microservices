import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { showToast } from '../components/ui/Toaster';
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Share2,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  StarHalf,
  Plus,
  Minus,
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, products } = useProduct();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(getProductById(id || ''));
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (!product) {
      // If product not found, navigate back to products page
      navigate('/products');
    }
  }, [product, navigate]);

  if (!product) {
    return null; // Will redirect via useEffect
  }

  // Get some related products based on category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    showToast(`${product.name} added to cart`, 'success');
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showToast(
      isFavorite
        ? `${product.name} removed from favorites`
        : `${product.name} added to favorites`,
      'info'
    );
  };

  // Generate some fake images for the product gallery
  const productImages = [
    product.imageUrl,
    'https://images.pexels.com/photos/4659716/pexels-photo-4659716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 h-96">
              <motion.img
                key={activeImageIndex}
                src={productImages[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <Heart
                  size={20}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}
                />
              </button>
            </div>

            <div className="flex space-x-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-24 h-24 rounded-md overflow-hidden border-2 ${
                    activeImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <p className="text-blue-600 font-medium">{product.category}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
            </div>

            {product.rating && (
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => {
                  if (i < Math.floor(product.rating)) {
                    return <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />;
                  } else if (i === Math.floor(product.rating) && product.rating % 1 !== 0) {
                    return <StarHalf key={i} size={18} className="fill-yellow-400 text-yellow-400" />;
                  } else {
                    return <Star key={i} size={18} className="text-gray-300" />;
                  }
                })}
                <span className="text-sm text-gray-600 ml-1">({product.rating.toFixed(1)})</span>
              </div>
            )}

            <div className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</div>

            <p className="text-gray-600">{product.description}</p>

            <div className="py-3">
              <p className="text-sm font-medium text-gray-500 mb-1">Quantity</p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    quantity <= 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stockQuantity}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    quantity >= product.stockQuantity
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="py-4">
              <div className="flex items-center text-sm mb-2">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    product.stockQuantity > 10 ? 'bg-green-500' : product.stockQuantity > 0 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                ></div>
                <span>
                  {product.stockQuantity > 10
                    ? 'In Stock'
                    : product.stockQuantity > 0
                    ? `Low Stock (${product.stockQuantity} left)`
                    : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-md font-medium ${
                  product.stockQuantity > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                <ShoppingCart size={20} className="mr-2" />
                {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </motion.button>

              <button className="flex-1 border border-gray-300 px-6 py-3 rounded-md font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                <Share2 size={20} className="mr-2" />
                Share
              </button>
            </div>

            <div className="border-t border-gray-200 pt-5 space-y-3">
              <div className="flex items-start">
                <Truck size={18} className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-500">Orders over $50 qualify for free shipping</p>
                </div>
              </div>

              <div className="flex items-start">
                <ShieldCheck size={18} className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-500">Your payment information is processed securely</p>
                </div>
              </div>

              <div className="flex items-start">
                <RefreshCw size={18} className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">30-Day Returns</p>
                  <p className="text-sm text-gray-500">Simple returns up to 30 days from purchase</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product details tabs */}
        <div className="border-t border-gray-200 p-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'description'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'specifications'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-600 mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-600 mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {product.specifications ? (
                      Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                            {key}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{value}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                          No specifications available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                  <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
                    Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
              >
                <Link to={`/products/${relatedProduct.id}`} className="block">
                  <div className="h-48">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">{relatedProduct.category}</div>
                    <h3 className="font-medium text-gray-900 mb-1 truncate">{relatedProduct.name}</h3>
                    <div className="text-lg font-bold text-gray-900">${relatedProduct.price.toFixed(2)}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
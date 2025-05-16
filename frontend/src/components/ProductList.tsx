import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, cartService } from '../services/api';
import type { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      await cartService.addToCart(productId, 1);
      // You might want to show a success notification here
    } catch (err) {
      // Handle error (show error notification)
      console.error('Failed to add to cart:', err);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <Link
              to={`/products/${product.id}`}
              className="text-lg font-semibold text-gray-800 hover:text-blue-600"
            >
              {product.name}
            </Link>
            <p className="mt-2 text-gray-600 text-sm">{product.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {user ? (
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Login to Buy
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 
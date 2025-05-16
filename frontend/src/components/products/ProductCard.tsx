import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../../types/product';
import { motion } from 'framer-motion';
import { showToast } from '../ui/Toaster';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
    showToast(`${product.name} added to cart`, 'success');
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    showToast(
      isFavorite 
        ? `${product.name} removed from favorites` 
        : `${product.name} added to favorites`, 
      'info'
    );
  };

  return (
    <motion.div
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative h-48">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          
          {/* Quick action buttons */}
          <div 
            className={`absolute top-2 right-2 flex flex-col gap-2 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-200`}
          >
            <button 
              onClick={toggleFavorite}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <Heart 
                size={18} 
                className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'} 
              />
            </button>
          </div>
          
          {product.stockQuantity <= 0 && (
            <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 text-sm uppercase font-semibold">
              Out of Stock
            </div>
          )}
          
          {product.featured && (
            <div className="absolute top-0 left-0 bg-blue-500 text-white px-3 py-1 text-sm uppercase font-semibold">
              Featured
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="text-sm text-gray-500 mb-1">{product.category}</div>
          <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
          
          <div className="flex items-end justify-between mt-2 mb-2">
            <div className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</div>
            
            {product.rating && (
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0}
            className={`mt-2 w-full flex items-center justify-center py-2 px-4 rounded-md ${
              product.stockQuantity > 0 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            } transition-colors text-sm font-medium`}
          >
            <ShoppingCart size={16} className="mr-2" />
            {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
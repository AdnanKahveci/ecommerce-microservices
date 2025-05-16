import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Menu, User, ShoppingCart, Search, X, LogOut, Settings } from 'lucide-react';
import UserMenu from '../user/UserMenu';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${searchQuery}`);
    setSearchQuery('');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">ShopEase</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">
              Products
            </Link>
          </nav>

          {/* Search, Cart, User */}
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
              <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
                <Search size={18} />
              </button>
            </form>

            <Link to="/cart" className="relative">
              <ShoppingCart className="text-gray-700 hover:text-blue-600" size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <User size={24} />
                  <span className="font-medium hidden lg:inline-block">
                    {user?.firstName}
                  </span>
                </button>
                {isUserMenuOpen && <UserMenu onClose={() => setIsUserMenuOpen(false)} />}
              </div>
            ) : (
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="text-gray-700" size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={toggleMenu} className="text-gray-500">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 pb-6 border-t border-gray-200">
            <Link
              to="/"
              className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            
            <form onSubmit={handleSearch} className="px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={18} />
                </button>
              </div>
            </form>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} className="mr-3" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/profile/settings"
                  className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings size={20} className="mr-3" />
                  <span>Settings</span>
                </Link>
                <button
                  className="flex items-center w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Implement logout
                  }}
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-3 px-4 text-blue-600 font-medium hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
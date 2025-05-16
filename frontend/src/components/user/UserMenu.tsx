import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Settings, Package, LogOut, Shield } from 'lucide-react';

interface UserMenuProps {
  onClose: () => void;
}

const UserMenu = ({ onClose }: UserMenuProps) => {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  // Close the menu when clicking outside
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-20" 
      onClick={handleClickOutside}
    >
      <div className="absolute right-0 top-16 w-64 bg-white rounded-md shadow-lg py-2 border border-gray-200 mr-4 animate-fadeIn">
        <div className="border-b border-gray-200 pb-3 px-4 mb-2">
          <Link 
            to="/profile" 
            className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md"
            onClick={onClose}
          >
            <User size={20} className="text-gray-500" />
            <div>
              <span className="font-medium">My Profile</span>
            </div>
          </Link>
        </div>
        
        <ul>
          <li>
            <Link 
              to="/profile/orders" 
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100"
              onClick={onClose}
            >
              <Package size={18} className="text-gray-500" />
              <span>My Orders</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/profile/settings" 
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100"
              onClick={onClose}
            >
              <Settings size={18} className="text-gray-500" />
              <span>Settings</span>
            </Link>
          </li>
          
          {isAdmin && (
            <li className="border-t border-gray-200 mt-2">
              <Link 
                to="/admin" 
                className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 text-blue-600"
                onClick={onClose}
              >
                <Shield size={18} />
                <span className="font-medium">Admin Dashboard</span>
              </Link>
            </li>
          )}
          
          <li className="border-t border-gray-200 mt-2">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserMenu;
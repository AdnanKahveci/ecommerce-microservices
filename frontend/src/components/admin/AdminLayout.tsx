import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Package, 
  Settings,
  ChevronRight, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { 
      path: '/admin', 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      path: '/admin/users', 
      name: 'User Management', 
      icon: <Users size={20} /> 
    },
    { 
      path: '/admin/products', 
      name: 'Product Management', 
      icon: <ShoppingBag size={20} /> 
    },
    { 
      path: '/admin/inventory', 
      name: 'Inventory', 
      icon: <Package size={20} /> 
    },
    { 
      path: '/admin/settings', 
      name: 'Settings', 
      icon: <Settings size={20} /> 
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-gray-500 focus:outline-none"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="text-2xl font-bold text-blue-600">Admin Panel</div>
          <div className="w-6"></div> {/* Empty div for centering */}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-full w-64 transition-transform duration-300 transform 
        bg-white border-r border-gray-200 shadow-sm
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <Link to="/" className="text-2xl font-bold text-blue-600">ShopEase</Link>
          </div>

          {/* Admin info */}
          <div className="flex items-center p-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 
                      ${isActive(item.path) ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                    {isActive(item.path) && (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`lg:ml-64 ${sidebarOpen ? 'overflow-hidden h-screen' : ''} pt-16 lg:pt-0`}>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
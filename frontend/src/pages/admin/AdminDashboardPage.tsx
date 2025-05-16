import { Link } from 'react-router-dom';
import { useProduct } from '../../contexts/ProductContext';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  DollarSign,
  TrendingUp,
  Clock,
  ChevronRight 
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { products } = useProduct();
  
  // Calculate quick stats
  const totalProducts = products.length;
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0).length;
  const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length;
  
  // Mock data for dashboard
  const mockStats = {
    totalUsers: 124,
    totalOrders: 215,
    totalRevenue: 12580.45,
    ordersToday: 12,
  };
  
  // Mock data for recent orders
  const recentOrders = [
    { id: 'ORD-3924', customer: 'John Doe', date: '2 hours ago', status: 'Completed', amount: 129.99 },
    { id: 'ORD-3923', customer: 'Jane Smith', date: '4 hours ago', status: 'Processing', amount: 89.99 },
    { id: 'ORD-3922', customer: 'Bob Johnson', date: '6 hours ago', status: 'Shipped', amount: 199.99 },
    { id: 'ORD-3921', customer: 'Alice Brown', date: '8 hours ago', status: 'Completed', amount: 67.50 },
    { id: 'ORD-3920', customer: 'David Wilson', date: '10 hours ago', status: 'Cancelled', amount: 155.00 },
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
              <DollarSign size={24} className="text-blue-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Total Revenue</p>
              <p className="text-xl font-semibold text-gray-900">${mockStats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp size={16} className="mr-1" />
            <span>12% increase</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
              <Users size={24} className="text-purple-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Total Users</p>
              <p className="text-xl font-semibold text-gray-900">{mockStats.totalUsers}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp size={16} className="mr-1" />
            <span>6% increase</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-100 rounded-full p-3">
              <Package size={24} className="text-orange-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Total Orders</p>
              <p className="text-xl font-semibold text-gray-900">{mockStats.totalOrders}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp size={16} className="mr-1" />
            <span>8% increase</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
              <ShoppingBag size={24} className="text-green-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Products</p>
              <p className="text-xl font-semibold text-gray-900">{totalProducts}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-yellow-600">
            <span>{outOfStockProducts} out of stock</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
              View all
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {order.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Inventory Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Status</h2>
            <Link to="/admin/inventory" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
              Manage inventory
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Products in stock</span>
                  <span className="text-sm font-medium text-gray-900">
                    {totalProducts - outOfStockProducts} / {totalProducts}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${((totalProducts - outOfStockProducts) / totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Low stock alerts</span>
                  <span className="text-sm font-medium text-gray-900">{lowStockProducts}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: `${(lowStockProducts / totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Out of stock</span>
                  <span className="text-sm font-medium text-gray-900">{outOfStockProducts}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-600 h-2.5 rounded-full"
                    style={{ width: `${(outOfStockProducts / totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Critical Stock Items</h3>
              <div className="space-y-2">
                {products
                  .filter(p => p.stockQuantity === 0)
                  .slice(0, 3)
                  .map(product => (
                    <div key={product.id} className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-md overflow-hidden bg-white">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                      <span className="text-xs font-medium text-red-600">Out of stock</span>
                    </div>
                  ))}
                
                {products
                  .filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5)
                  .slice(0, 2)
                  .map(product => (
                    <div key={product.id} className="flex items-center justify-between py-2 px-3 bg-yellow-50 rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-md overflow-hidden bg-white">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                      <span className="text-xs font-medium text-yellow-600">Low stock ({product.stockQuantity})</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
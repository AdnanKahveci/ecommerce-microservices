import { useState } from 'react';
import { useProduct } from '../../contexts/ProductContext';
import { showToast } from '../../components/ui/Toaster';
import { Search, ArrowUpDown, Save, AlertTriangle } from 'lucide-react';

const AdminInventoryPage = () => {
  const { products, updateProductStock } = useProduct();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [updatedStock, setUpdatedStock] = useState<Record<string, number>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Filter products based on search and filter criteria
  let filteredProducts = [...products];
  
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (filter === 'low') {
    filteredProducts = filteredProducts.filter(
      product => product.stockQuantity > 0 && product.stockQuantity <= 5
    );
  } else if (filter === 'out') {
    filteredProducts = filteredProducts.filter(product => product.stockQuantity === 0);
  }
  
  // Sort products
  filteredProducts.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'stock') {
      comparison = a.stockQuantity - b.stockQuantity;
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as 'all' | 'low' | 'out');
  };
  
  const handleSortChange = (column: 'name' | 'stock' | 'category') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  
  const handleStockChange = (productId: string, value: string) => {
    const numValue = parseInt(value, 10);
    
    if (!isNaN(numValue) && numValue >= 0) {
      setUpdatedStock(prev => ({
        ...prev,
        [productId]: numValue,
      }));
    }
  };
  
  const saveStockChanges = async () => {
    if (Object.keys(updatedStock).length === 0) return;
    
    setIsUpdating(true);
    let successCount = 0;
    
    for (const [productId, newStock] of Object.entries(updatedStock)) {
      const success = updateProductStock(productId, newStock);
      if (success) successCount++;
    }
    
    showToast(`Updated stock for ${successCount} products`, 'success');
    setUpdatedStock({});
    setIsUpdating(false);
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Inventory Management</h1>
        
        <button
          onClick={saveStockChanges}
          disabled={Object.keys(updatedStock).length === 0 || isUpdating}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            Object.keys(updatedStock).length === 0 || isUpdating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Save size={16} className="mr-2" />
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <select
              value={filter}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Products</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>
        
        {filter === 'low' && (
          <div className="bg-yellow-50 p-4 border-b border-yellow-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Low Stock Alert
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    The following products have 5 or fewer items in stock. Consider restocking these items soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {filter === 'out' && (
          <div className="bg-red-50 p-4 border-b border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Out of Stock Alert
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    The following products are currently out of stock. These items need immediate attention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('name')}
                >
                  <div className="flex items-center">
                    Product
                    {sortBy === 'name' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('category')}
                >
                  <div className="flex items-center">
                    Category
                    {sortBy === 'category' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('stock')}
                >
                  <div className="flex items-center">
                    Current Stock
                    {sortBy === 'stock' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Update Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      product.stockQuantity === 0
                        ? 'text-red-600'
                        : product.stockQuantity <= 5
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                      {product.stockQuantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          const currentStock = updatedStock[product.id] ?? product.stockQuantity;
                          if (currentStock > 0) {
                            handleStockChange(product.id, String(currentStock - 1));
                          }
                        }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={updatedStock[product.id] ?? product.stockQuantity}
                        onChange={(e) => handleStockChange(product.id, e.target.value)}
                        className={`mx-2 w-16 text-center rounded-md border ${
                          updatedStock[product.id] !== undefined
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-300'
                        }`}
                      />
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          const currentStock = updatedStock[product.id] ?? product.stockQuantity;
                          handleStockChange(product.id, String(currentStock + 1));
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.stockQuantity === 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Out of stock
                      </span>
                    ) : product.stockQuantity <= 5 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Low stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        In stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
        
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredProducts.length}</span> of{' '}
              <span className="font-medium">{products.length}</span> products
            </div>
            {Object.keys(updatedStock).length > 0 && (
              <div className="text-sm font-medium text-blue-600">
                {Object.keys(updatedStock).length} items have unsaved changes
              </div>
            )}
          </div>
        </div>
      </div>
      
      {Object.keys(updatedStock).length > 0 && (
        <div className="fixed bottom-0 inset-x-0 pb-6 px-4 sm:px-6 lg:pl-72 bg-gradient-to-t from-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-md shadow-sm border border-blue-200">
              <span className="text-sm font-medium text-blue-800">
                You have made changes to {Object.keys(updatedStock).length} product{Object.keys(updatedStock).length > 1 ? 's' : ''}
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={() => setUpdatedStock({})}
                  className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStockChanges}
                  disabled={isUpdating}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventoryPage;
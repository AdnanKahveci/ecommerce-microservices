import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProduct } from '../contexts/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import { Filter, X, Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, filterProducts, searchProducts } = useProduct();
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const categories = ['All', ...new Set(products.map(product => product.category))];

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
    
    // Apply filters based on URL params
    applyFilters(searchParam || '', categoryParam || '');
  }, [location.search]);

  const applyFilters = (search: string, category: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      let result = products;
      
      if (search) {
        result = searchProducts(search);
      }
      
      if (category && category !== 'All') {
        result = result.filter(product => product.category === category);
      }
      
      if (filters.minPrice) {
        result = result.filter(product => product.price >= Number(filters.minPrice));
      }
      
      if (filters.maxPrice) {
        result = result.filter(product => product.price <= Number(filters.maxPrice));
      }
      
      if (filters.inStock) {
        result = result.filter(product => product.stockQuantity > 0);
      }
      
      setFilteredProducts(result);
      setIsLoading(false);
    }, 500);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCategoryClick = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: category === 'All' ? '' : category
    }));
    
    updateQueryParams(category === 'All' ? '' : category);
  };

  const updateQueryParams = (category = filters.category) => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    if (category) {
      params.set('category', category);
    }
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
    });
    setSearchQuery('');
    navigate(location.pathname);
  };

  const applyAllFilters = () => {
    updateQueryParams();
    setIsFilterOpen(false);
  };

  // Toggle mobile filter sidebar
  const toggleFilterSidebar = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Shop All Products</h1>
        
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </button>
          </form>
          
          <button
            onClick={toggleFilterSidebar}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 md:hidden"
          >
            <SlidersHorizontal size={18} className="mr-2" />
            Filters
          </button>
        </div>
      </div>
      
      {/* Category tabs (desktop) */}
      <div className="hidden md:flex mb-6 overflow-x-auto space-x-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap ${
              (category === 'All' && !filters.category) || filters.category === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar (desktop) */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Filter size={18} className="mr-2" />
                Filters
              </h3>
              {(filters.category || filters.minPrice || filters.maxPrice || filters.inStock) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={filters.inStock}
                    onChange={handleFilterChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">In stock only</span>
                </label>
              </div>
              
              <button
                onClick={applyAllFilters}
                className="w-full bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile filter sidebar */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={toggleFilterSidebar}
              />
              
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween' }}
                className="fixed right-0 top-0 h-full w-80 bg-white z-50 p-5 overflow-y-auto md:hidden"
              >
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-semibold text-gray-900 text-lg">Filters</h3>
                  <button onClick={toggleFilterSidebar}>
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="categoryMobile"
                            value={category}
                            checked={(category === 'All' && !filters.category) || filters.category === category}
                            onChange={() => handleCategoryClick(category)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="text-sm text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price range</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={filters.inStock}
                        onChange={handleFilterChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">In stock only</span>
                    </label>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={clearFilters}
                      className="flex-1 bg-gray-100 text-gray-800 rounded-md py-2 text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={applyAllFilters}
                      className="flex-1 bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Products grid */}
        <div className="flex-1">
          {(searchQuery || filters.category || filters.minPrice || filters.maxPrice || filters.inStock) && (
            <div className="mb-5 flex flex-wrap gap-2 items-center bg-gray-50 p-3 rounded-md">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              
              {searchQuery && (
                <div className="flex items-center bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                  <span className="mr-1">Search:</span>
                  <span className="font-medium">{searchQuery}</span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      updateQueryParams();
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              {filters.category && (
                <div className="flex items-center bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                  <span className="mr-1">Category:</span>
                  <span className="font-medium">{filters.category}</span>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, category: '' }));
                      updateQueryParams('');
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              {(filters.minPrice || filters.maxPrice) && (
                <div className="flex items-center bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                  <span className="mr-1">Price:</span>
                  <span className="font-medium">
                    {filters.minPrice ? `$${filters.minPrice}` : '$0'} 
                    {' - '} 
                    {filters.maxPrice ? `$${filters.maxPrice}` : 'Any'}
                  </span>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
                      updateQueryParams();
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              {filters.inStock && (
                <div className="flex items-center bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                  <span className="font-medium">In stock only</span>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, inStock: false }));
                      updateQueryParams();
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
          
          <ProductGrid products={filteredProducts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
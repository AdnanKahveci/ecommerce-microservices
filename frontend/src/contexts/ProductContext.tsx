import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/api';
import type { Product, Category } from '../types';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  getProductById: (id: number) => Product | undefined;
  getProductsByCategory: (categoryId: number) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const getProductById = (id: number) => {
    return products.find((product) => product.id === id);
  };

  const getProductsByCategory = (categoryId: number) => {
    return products.filter((product) => product.category_id === categoryId);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        isLoading,
        error,
        refreshProducts,
        getProductById,
        getProductsByCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}
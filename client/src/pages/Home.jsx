import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStore, setActiveStore] = useState('indianmart');
  const { keyword } = useParams();

  const displayedProducts = products.filter(p => (p.storeType || 'indianmart') === activeStore);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products${keyword ? `?keyword=${keyword}` : ''}`);
        setProducts(data.products || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          {keyword ? `Search Results for "${keyword}"` : 'Latest Products'}
        </h1>
        {!keyword && (
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setActiveStore('indianmart')}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${activeStore === 'indianmart' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
            >
              IndianMart (General)
            </button>
            <button
              onClick={() => setActiveStore('grocery')}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${activeStore === 'grocery' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Grocery
            </button>
          </div>
        )}
      </div>

      {displayedProducts.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

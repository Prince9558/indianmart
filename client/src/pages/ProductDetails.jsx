import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (product.stock > 0) {
      await addToCart(product, 1);
      toast.success('Item added to cart!');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="bg-white rounded-sm shadow-sm md:flex overflow-hidden max-w-6xl mx-auto">
      <div className="md:w-2/5 p-4 flex flex-col items-center border-r border-gray-100">
        <div className="h-96 w-full flex items-center justify-center p-4">
          <img src={product.image} alt={product.name} className="max-h-full object-contain" />
        </div>
        <div className="flex w-full space-x-2 mt-4 px-4 pb-4">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 py-3 font-bold rounded-sm text-white ${product.stock > 0 ? 'bg-secondary hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            ADD TO CART
          </button>
          <Link
            to="/cart"
            onClick={handleAddToCart}
            className={`flex-1 flex justify-center items-center py-3 font-bold rounded-sm text-white ${product.stock > 0 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed pointer-events-none'}`}
          >
            BUY NOW
          </Link>
        </div>
      </div>
      
      <div className="md:w-3/5 p-6 md:p-8">
        <h1 className="text-2xl font-medium text-gray-800 mb-2">
          {product.name} {product.measurement && <span className="text-lg text-gray-500 ml-2">({product.measurement})</span>}
        </h1>
        <p className="text-sm text-gray-500 mb-4">{product.category}</p>
        <div className="text-3xl font-bold text-gray-900 mb-6">₹{product.price}</div>
        
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">{product.description}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">Availability:</span>
          {product.stock > 5 ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : product.stock > 0 ? (
            <span className="text-red-500 font-medium">Only {product.stock} items left!</span>
          ) : (
            <span className="text-red-500 font-medium">Out of Stock</span>
          )}
        </div>

        {product.expiryDate && (
          <div className="flex items-center space-x-2 mt-2">
            <span className="font-medium text-gray-900">Expiry Date:</span>
            <span className="text-gray-700">{new Date(product.expiryDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

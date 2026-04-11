import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="bg-white rounded-md shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col p-4">
        <div className="h-48 w-full flex-shrink-0 flex items-center justify-center overflow-hidden mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-grow flex flex-col justify-end text-center">
          <h2 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h2>
          <div className="text-gray-500 text-xs mb-1">
            {product.category} {product.measurement && `• ${product.measurement}`}
          </div>
          <div className="text-lg font-bold text-gray-900 mb-1">
            ₹{product.price}
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <div className="text-xs font-semibold text-red-500">Only {product.stock} left!</div>
          )}
          {product.stock === 0 && (
            <div className="text-xs font-semibold text-gray-400">Out of Stock</div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

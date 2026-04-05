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
          <h2 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h2>
          <div className="text-gray-500 text-xs mb-1">{product.category}</div>
          <div className="text-lg font-bold text-gray-900">
            ₹{product.price}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

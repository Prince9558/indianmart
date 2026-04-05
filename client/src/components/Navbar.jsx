import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUser } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
        <Link to="/" className="text-2xl font-bold italic">
          IndianMart
        </Link>
        
        <form onSubmit={handleSearch} className="flex-grow md:mx-8 w-full md:w-auto relative">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-sm text-black focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-primary">
            <FaSearch size={18} />
          </button>
        </form>

        <div className="flex items-center space-x-6 text-sm font-medium">
          {user ? (
            <div className="group relative cursor-pointer flex items-center space-x-1">
              <span>{user.name}</span>
              <div className="hidden group-hover:block absolute top-full right-0 pt-2 w-40 z-50">
                <div className="flex flex-col bg-white text-black shadow-lg rounded-sm overflow-hidden border border-gray-100">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="px-4 py-2 hover:bg-gray-100 border-b">Dashboard</Link>
                  )}
                  <Link to="/mine" className="px-4 py-2 hover:bg-gray-100 border-b">Orders</Link>
                  <button onClick={handleLogout} className="px-4 py-2 text-left hover:bg-gray-100 w-full">Logout</button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-primary px-8 py-1 rounded-sm font-bold hover:bg-gray-50 transition">
              Login
            </Link>
          )}

          <Link to="/cart" className="flex items-center space-x-1 hover:text-gray-200">
            <div className="relative">
              <FaShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline">Cart</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

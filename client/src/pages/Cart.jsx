import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loadingCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="text-center py-20 bg-white shadow-sm mt-4">
        <h2 className="text-2xl font-bold mb-4">Please login to view your cart</h2>
        <Link to="/login" className="bg-primary text-white px-8 py-2 rounded-sm font-medium">Login</Link>
      </div>
    );
  }

  if (loadingCart) return <div className="text-center py-10">Loading cart...</div>;

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white shadow-sm mt-4">
        <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="w-1/4 mx-auto mb-6" />
        <h2 className="text-2xl font-medium mb-4">Your cart is empty!</h2>
        <p className="text-gray-500 mb-6">Add items to it now.</p>
        <Link to="/" className="bg-primary text-white px-16 py-3 rounded-sm font-medium shadow-md">Shop Now</Link>
      </div>
    );
  }

  const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-4 max-w-7xl mx-auto">
      <div className="lg:w-2/3 bg-white shadow-sm rounded-sm p-4">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-medium">My Cart ({items.length})</h2>
        </div>
        
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.product._id} className="flex flex-col sm:flex-row border-b pb-6">
              <div className="w-full sm:w-32 h-32 flex-shrink-0 mb-4 sm:mb-0">
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <button 
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold pb-1"
                  >-</button>
                  <span className="w-10 h-8 border border-gray-300 flex items-center justify-center text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold pb-1"
                  >+</button>
                </div>
              </div>
              
              <div className="sm:ml-6 flex-grow">
                <Link to={`/product/${item.product._id}`} className="hover:text-primary transition font-medium text-lg mb-1 block">
                  {item.product.name}
                </Link>
                <div className="text-sm text-gray-500 mb-4">Seller: RetailNet</div>
                <div className="text-2xl font-bold mb-4">₹{item.product.price}</div>
                <button 
                  onClick={() => removeFromCart(item.product._id)}
                  className="font-medium hover:text-primary transition"
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end pt-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] mt-4">
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-secondary text-white px-10 py-4 font-bold text-lg rounded-sm hover:bg-yellow-600 transition shadow-md"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
      
      <div className="lg:w-1/3">
        <div className="bg-white shadow-sm rounded-sm p-4 sticky top-4">
          <h3 className="text-gray-500 font-medium border-b pb-4 mb-4 uppercase text-sm">Price Details</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Price ({items.length} items)</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600">Free</span>
            </div>
          </div>
          <div className="border-t border-dashed mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const items = cart?.items || [];
  const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  if (items.length === 0) {
    navigate('/');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!deliveryLocation || !mobileNumber) {
      return toast.error('Please fill in your delivery location and mobile number');
    }

    try {
      setLoading(true);
      const orderItems = items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        image: item.product.image,
        price: item.product.price,
        product: item.product._id
      }));

      await api.post('/orders', {
        orderItems,
        paymentMethod,
        totalPrice,
        deliveryLocation,
        mobileNumber
      });

      await clearCart();
      toast.success('Order Placed Successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-8 rounded-sm shadow-sm">
      <h2 className="text-2xl font-bold bg-primary text-white p-3 rounded-sm mb-6 uppercase">Checkout</h2>
      
      <div className="mb-6 p-4 border rounded-sm">
        <h3 className="font-bold text-gray-500 uppercase text-xs mb-4">Delivery Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Delivery Address / Location</label>
            <textarea 
              required 
              rows="2" 
              value={deliveryLocation} 
              onChange={e => setDeliveryLocation(e.target.value)} 
              className="w-full border rounded p-2 focus:outline-none focus:border-primary"
              placeholder="Enter your full address"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Mobile Number</label>
            <input 
              required 
              type="text" 
              value={mobileNumber} 
              onChange={e => setMobileNumber(e.target.value)} 
              className="w-full border rounded p-2 focus:outline-none focus:border-primary"
              placeholder="10-digit mobile number"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 border rounded-sm">
        <h3 className="font-bold text-gray-500 uppercase text-xs mb-4">Payment Options</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="radio" 
              name="payment"
              value="COD"
              checked={paymentMethod === 'COD'} 
              onChange={() => setPaymentMethod('COD')}
              className="w-4 h-4 text-primary" 
            />
            <span className="font-medium text-lg">Cash on Delivery (COD)</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer mt-2">
            <input 
              type="radio" 
              name="payment"
              value="UPI"
              checked={paymentMethod === 'UPI'} 
              onChange={() => setPaymentMethod('UPI')}
              className="w-4 h-4 text-primary" 
            />
            <span className="font-medium text-lg">UPI (Google Pay, PhonePe, Paytm)</span>
          </label>
          {paymentMethod === 'UPI' && (
            <p className="ml-7 mt-1 text-sm text-yellow-600 font-medium">Note: UPI Payment integration will be added later. It will currently bypass processing.</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-gray-500 uppercase text-xs mb-4">Order Summary</h3>
        <div className="border rounded-sm p-4">
          {items.map(item => (
            <div key={item.product._id} className="flex justify-between items-center mb-3 text-sm">
              <span className="truncate w-2/3 pr-2">{item.product.name} (x{item.quantity})</span>
              <span className="font-medium whitespace-nowrap">₹{item.product.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold text-lg mt-3">
            <span>Total Amount</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`bg-secondary text-white px-10 py-3 font-bold text-lg rounded-sm shadow-md transition ${loading ? 'opacity-50' : 'hover:bg-yellow-600'}`}
        >
          {loading ? 'Placing Order...' : 'CONFIRM ORDER'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;

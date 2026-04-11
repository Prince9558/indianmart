import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Product Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '', price: '', description: '', category: '', stock: '', expiryDate: '', measurement: '', storeType: 'indianmart'
  });
  const [productImage, setProductImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchProducts();
      fetchOrders();
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.products || []);
    } catch (err) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(productForm).forEach(key => formData.append(key, productForm[key]));
    if (productImage) formData.append('image', productImage);

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated!');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product created!');
      }
      setShowProductModal(false);
      fetchProducts();
      resetProductForm();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error('Error deleting product');
      }
    }
  };

  const handleEditProduct = (p) => {
    setProductForm({
      name: p.name, price: p.price, description: p.description, category: p.category, stock: p.stock,
      expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString().split('T')[0] : '', measurement: p.measurement || '', storeType: p.storeType || 'indianmart'
    });
    setEditingId(p._id);
    setShowProductModal(true);
  };

  const resetProductForm = () => {
    setProductForm({ name: '', price: '', description: '', category: '', stock: '', expiryDate: '', measurement: '', storeType: 'indianmart' });
    setProductImage(null);
    setEditingId(null);
  };

  const handleOrderStatusUpdate = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Error updating order');
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      
      <div className="flex space-x-4 mb-6 border-b pb-2">
        <button 
          className={`font-medium pb-2 ${activeTab === 'products' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
        <button 
          className={`font-medium pb-2 ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('orders')}
        >
          Manage Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Products List</h2>
            <button 
              onClick={() => { resetProductForm(); setShowProductModal(true); }}
              className="bg-primary text-white px-4 py-2 rounded-sm shadow hover:bg-blue-600 transition"
            >
              + Add New Product
            </button>
          </div>
          
          <div className="bg-white shadow-sm rounded-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">NAME</th>
                  <th className="p-3 border-b">PRICE</th>
                  <th className="p-3 border-b">CATEGORY</th>
                  <th className="p-3 border-b">STOCK</th>
                  <th className="p-3 border-b">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-xs text-gray-500">{p._id}</td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">₹{p.price}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      <button onClick={() => handleEditProduct(p)} className="text-blue-500 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white shadow-sm rounded-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="p-3 border-b">ORDER ID</th>
                <th className="p-3 border-b">USER</th>
                <th className="p-3 border-b">DATE</th>
                <th className="p-3 border-b">TOTAL</th>
                <th className="p-3 border-b">STATUS</th>
                <th className="p-3 border-b">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-xs text-gray-500">{o._id}</td>
                  <td className="p-3">{o.user?.name || 'Unknown'}</td>
                  <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 font-bold">₹{o.totalPrice}</td>
                  <td className="p-3">
                     <span className={`px-2 py-1 rounded text-xs ${o.status === 'Delivered' ? 'bg-green-100 text-green-600' : o.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                       {o.status}
                     </span>
                  </td>
                  <td className="p-3">
                    <select 
                      value={o.status} 
                      onChange={(e) => handleOrderStatusUpdate(o._id, e.target.value)}
                      className="border rounded p-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full border rounded p-2 focus:outline-none focus:border-primary" />
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Price (₹)</label>
                  <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full border rounded p-2 focus:outline-none focus:border-primary" />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Stock</label>
                  <input required type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full border rounded p-2 focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Category</label>
                  <input required type="text" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full border rounded p-2 focus:outline-none focus:border-primary" />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Measurable Quantity (e.g. 500g)</label>
                  <input type="text" value={productForm.measurement} onChange={e => setProductForm({...productForm, measurement: e.target.value})} className="w-full border rounded p-2 focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Store Type</label>
                  <div className="flex items-center space-x-4 mt-2">
                    <label className="flex items-center">
                      <input type="radio" value="indianmart" checked={productForm.storeType === 'indianmart'} onChange={e => setProductForm({...productForm, storeType: e.target.value})} className="mr-2" />
                      IndianMart
                    </label>
                    <label className="flex items-center">
                      <input type="radio" value="grocery" checked={productForm.storeType === 'grocery'} onChange={e => setProductForm({...productForm, storeType: e.target.value})} className="mr-2" />
                      Grocery
                    </label>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Expiry Date (Optional)</label>
                  <input type="date" value={productForm.expiryDate} onChange={e => setProductForm({...productForm, expiryDate: e.target.value})} className="w-full border rounded p-2 focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea required rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full border rounded p-2 focus:outline-none focus:border-primary"></textarea>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Product Image {editingId && '(Leave empty to keep existing)'}</label>
                <input type="file" accept="image/*" onChange={e => setProductImage(e.target.files[0])} className="w-full border rounded p-2" required={!editingId} />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 shadow">{editingId ? 'Update' : 'Create'} Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

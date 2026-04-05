import mongoose from 'mongoose';

const singleOrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [singleOrderItemSchema],
  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryLocation: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    default: 'COD',
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;

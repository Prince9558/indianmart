import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
  },
  measurement: {
    type: String,
  },
  storeType: {
    type: String,
    enum: ['indianmart', 'grocery'],
    default: 'indianmart',
  },
  stock: {
    type: Number,
    required: [true, 'Please provide product stock'],
    default: 1,
  },
  sold: {
    type: Number,
    default: 0,
  },
  expiryDate: {
    type: Date,
  },
  image: {
    type: String,
    required: [true, 'Please provide product image'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;

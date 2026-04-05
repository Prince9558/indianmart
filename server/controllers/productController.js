import Product from '../models/ProductModel.js';
import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config will be done in server.js but we can use the v2 object here
const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};
      
    const category = req.query.category ? { category: req.query.category } : {};

    const filter = { ...keyword, ...category };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({ products, page, pages: Math.ceil(count / pageSize), count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin only
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock, expiryDate } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await uploadImage(req.file.buffer);
      imageUrl = result.secure_url;
    } else if (req.body.image) {
      imageUrl = req.body.image; // allow passing url string
    }

    const product = new Product({
      name,
      price: Number(price),
      description,
      category,
      stock: Number(stock),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      image: imageUrl,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock, expiryDate } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price ? Number(price) : product.price;
      product.description = description || product.description;
      product.category = category || product.category;
      product.stock = stock ? Number(stock) : product.stock;
      if (expiryDate !== undefined) {
          product.expiryDate = expiryDate ? new Date(expiryDate) : undefined;
      }

      if (req.file) {
        const result = await uploadImage(req.file.buffer);
        product.image = result.secure_url;
      }

      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.status(200).json({ message: 'Product removed' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

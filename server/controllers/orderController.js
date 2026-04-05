import Order from '../models/OrderModel.js';
import Product from '../models/ProductModel.js';

export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, paymentMethod, totalPrice, deliveryLocation, mobileNumber } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ error: 'No order items' });
    }

    // Verify stock
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ error: `Product not found: ${item.name}` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
      }
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      paymentMethod,
      totalPrice,
      deliveryLocation,
      mobileNumber
    });

    const createdOrder = await order.save();

    // Decrease stock, increase sold
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin only
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin only
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      const oldStatus = order.status;
      order.status = req.body.status || order.status;

      // Handle cancellation logic (restore stock)
      if (order.status === 'Cancelled' && oldStatus !== 'Cancelled') {
        for (let item of order.orderItems) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock += item.quantity;
            product.sold -= item.quantity;
            await product.save();
          }
        }
      }

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

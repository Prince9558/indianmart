import Cart from '../models/CartModel.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price image stock');
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const syncCart = async (req, res) => {
  try {
    const { items } = req.body; // Expecting array of { product: productId, quantity: Number }
    
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }
    
    cart.items = items;
    await cart.save();
    
    // Populate before sending back
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ message: 'Cart cleared', items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Item from '../models/itemModel.js';
import bcrypt from 'bcryptjs';

export const placeOrder = async (req, res) => {
    try {
        const buyerId = req.user.id;

        // Fetch cart items of the user
        const cartItems = await Cart.find({ userId: buyerId }).populate('productId');

        if (!cartItems.length) {
            return res.status(400).json({ success: false, message: "Your cart is empty" });
        }

        const ordersWithOtp = []; // Temporary array for mapping orderId -> plain OTP

        // Process each cart item as an order
        for (const cartItem of cartItems) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOtp = await bcrypt.hash(otp, 10);

            const newOrder = new Order({
                buyerId,
                sellerId: cartItem.productId.sellerId,
                Item: cartItem.productId._id,
                hashedOtp  // only hashed OTP is stored
            });

            await newOrder.save();
            ordersWithOtp.push({ orderId: newOrder._id, otp });
            await Item.findByIdAndUpdate(cartItem.productId._id, { status: 'sold' });
        }

        await Cart.deleteMany({ userId: buyerId });

        // Return OTP mapping along with success message
        res.json({ success: true, message: "Order placed successfully!", ordersWithOtp });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const pendingOrders = await Order.find({ buyerId: userId, transactionStatus: 'Pending' }).populate('Item');
        const boughtItems = await Order.find({ buyerId: userId, transactionStatus: 'Completed' }).populate('Item');
        const soldItems = await Order.find({ sellerId: userId, transactionStatus: 'Completed' }).populate('Item');

        res.json({ success: true, pendingOrders, boughtItems, soldItems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const closeOrder = async (req, res) => {
    try {
        const { orderId, otp } = req.body;
        // Find the order for the seller
        const order = await Order.findOne({ _id: orderId, sellerId: req.user.id });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        // Verify the OTP
        const match = await bcrypt.compare(otp, order.hashedOtp);
        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        // Update the order status as Completed
        order.transactionStatus = 'Completed';
        await order.save();
        res.json({ success: true, message: "Order completed successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDeliverOrders = async (req, res) => {
    try {
        const sellerId = req.user.id;
        // Find all orders where the seller is the current user and status is Pending
        const deliverOrders = await Order.find({ sellerId, transactionStatus: 'Pending' })
          .populate('Item')
          .populate({ path: 'buyerId', select: 'email name' });
        res.json({ success: true, deliverOrders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

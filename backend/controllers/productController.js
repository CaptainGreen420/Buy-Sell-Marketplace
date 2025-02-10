import Item from "../models/itemModel.js";
import Cart from "../models/cartModel.js"; // Import the Cart model

export const addProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        const sellerId = req.user.id; // Extracted from authentication middleware

        if (!name || !price || !description || !category) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newProduct = new Item({ name, price, description, category, sellerId });
        await newProduct.save();

        res.json({ success: true, message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const products = await Item.find({ sellerId });

        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Item.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, product });
    } catch (error) {
        if (error.name === 'UnauthorizedError') {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Item.find();
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await Cart.find({ userId })
            .populate('productId', 'name price description category sellerId status');
        
        if (!cartItems) {
            return res.json({ success: true, cartItems: [] });
        }

        const populatedCartItems = cartItems.map(cartItem => ({
            _id: cartItem._id,
            productId: cartItem.productId._id,
            name: cartItem.productId.name,
            price: cartItem.productId.price,
            description: cartItem.productId.description,
            category: cartItem.productId.category,
            sellerId: cartItem.productId.sellerId,
            status: cartItem.productId.status
        }));

        res.json({ success: true, cartItems: populatedCartItems });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching cart items",
            error: error.message 
        });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItemId = req.params.id;
        await Cart.findOneAndDelete({ _id: cartItemId, userId });
        res.json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        
        console.log("Adding to cart - UserID:", userId, "ProductID:", productId);

        const product = await Item.findById(productId).populate('sellerId', 'firstName lastName');
        if (!product) {
            console.error("Product not found - ID:", productId);
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        console.log("Product found:", product);
        console.log("Product sellerId:", product.sellerId);
        console.log("Current userId:", userId);

        if (product.sellerId._id.toString() === userId.toString()) {
            console.error(`Cannot add own product - SellerId: ${product.sellerId._id}, UserId: ${userId}`);
            return res.status(400).json({ 
                success: false, 
                message: "You cannot add your own product to the cart"
            });
        }

        // Check if the product is already in the cart
        const existingCartItem = await Cart.findOne({ userId, productId });
        if (existingCartItem) {
            console.error("Product already in cart - UserID:", userId, "ProductID:", productId);
            return res.status(400).json({ success: false, message: "Product already in cart" });
        }

        // Add the product to the cart
        const newCartItem = new Cart({ userId, productId });
        const savedCart = await newCartItem.save();
        console.log("Cart item saved:", savedCart);

        res.json({ 
            success: true, 
            message: "Product added to cart successfully", 
            cartItem: newCartItem 
        });
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error adding to cart",
            error: error.message 
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        // Use req.user.id or fallback to req.user._id
        const userId = req.user.id || req.user._id;
        
        const product = await Item.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Allow deletion only if the current user is the seller using equals()
        if (!product.sellerId.equals(userId)) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this product" });
        }

        // If product has been sold, do not delete and return "already sold"
        if (product.status === 'sold') {
            return res.status(400).json({ success: false, message: "already sold" });
        }

        // Delete the product from the Items database
        await Item.findByIdAndDelete(productId);
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
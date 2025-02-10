import express from 'express';
import { addProduct, getSellerProducts, getProductById, getAllProducts, getCartItems, removeCartItem, addToCart, deleteProduct } from '../controllers/productController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Root route for testing
router.get("/", (req, res) => {
    res.send("Product API is running...");
});

router.post("/add", authenticateToken, addProduct);
router.get("/seller-products", authenticateToken, getSellerProducts);
router.get("/all", authenticateToken, getAllProducts);
router.get("/:id", authenticateToken, getProductById);
router.get('/cart/items', authenticateToken, getCartItems);
router.post('/cart/add', authenticateToken, addToCart);
router.delete('/cart/:id', authenticateToken, removeCartItem);
router.delete('/delete/:id', authenticateToken, deleteProduct);

export default router;

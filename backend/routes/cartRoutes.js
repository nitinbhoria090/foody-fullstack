const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addToCart,
    getCart,
    updateCart,
    removeFromCart,
    clearCart
} = require("../controllers/cartController");



router.post("/add", authMiddleware, addToCart);
router.get(
    "/",
    authMiddleware,
    getCart
);
router.put(
    "/update/:productId",
    authMiddleware,
    updateCart
);

router.delete(
    "/remove/:productId",
    authMiddleware,
    removeFromCart
);

router.delete(
    "/clear",
    authMiddleware,
    clearCart
);

module.exports = router;
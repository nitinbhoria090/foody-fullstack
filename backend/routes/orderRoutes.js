const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

// User Routes
router.post("/place", authMiddleware, placeOrder);

router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/:id", authMiddleware, getOrderById);

// Admin Routes
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);

router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);

module.exports = router;
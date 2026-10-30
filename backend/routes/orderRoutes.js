
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const riderMiddleware = require("../middleware/riderAuthMiddleware");

const {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    assignRider,
    getRiderOrders,
    updateRiderLocation,
    getAllRiders,
    markOrderDelivered
} = require("../controllers/orderController");

// User Routes
router.post("/place", authMiddleware, placeOrder);
router.get("/my-orders", authMiddleware, getMyOrders);

// Rider Routes
router.get("/rider/my-orders", authMiddleware, riderMiddleware, getRiderOrders);
router.patch("/:id/location", authMiddleware, riderMiddleware, updateRiderLocation);

router.put("/:id/deliver", authMiddleware, riderMiddleware, markOrderDelivered);
// Admin Routes
router.get("/riders", authMiddleware, adminMiddleware, getAllRiders);
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);
router.put("/:id/assign-rider", authMiddleware, adminMiddleware, assignRider);

// Generic :id route — sabse last mein rakho
router.get("/:id", authMiddleware, getOrderById);

module.exports = router;

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Address = require("../models/Address");
const User = require("../models/User");
const Rider = require("../models/Rider");

const placeOrder = async (req, res) => {
    try {

        const { addressId, paymentMethod } = req.body;

        if (!addressId) {
            return res.status(400).json({
                success: false,
                message: "Address is required"
            });
        }

        // Check Address
        const address = await Address.findOne({
            _id: addressId,
            user: req.user.id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // Get Cart
        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        let totalItems = 0;
        let totalPrice = 0;

        const orderItems = [];

        for (const item of cart.items) {

            if (!item.product) continue;

            totalItems += item.quantity;

            totalPrice += item.quantity * item.product.price;

            orderItems.push({
                product: item.product._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity
            });

        }

        const order = await Order.create({

            user: req.user.id,

            address: address._id,

            items: orderItems,

            totalItems,

            totalPrice,

            paymentMethod: paymentMethod || "COD"

        });

        // Clear Cart
        cart.items = [];

        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order Placed Successfully",
            order
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getMyOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            user: req.user.id
        })
        .populate("address")
        .sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate("address");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
    try {

        const { orderStatus } = req.body;

        const validStatus = [
            "Pending",
            "Preparing",
            "Out For Delivery",
            "Delivered",
            "Cancelled"
        ];

        if (!validStatus.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.orderStatus = orderStatus;

        // Payment status auto update
        if (
            order.paymentMethod === "COD" &&
            orderStatus === "Delivered"
        ) {
            order.paymentStatus = "Paid";
        }

        await order.save();

        order = await Order.findById(order._id)
            .populate("user", "name email")
            .populate("address");

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get All Orders (Admin)
const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("user", "name email")
            .populate("address")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// Admin: Get all delivery riders (for assign dropdown)
const getAllRiders = async (req, res) => {
    try {

        const riders = await Rider.find({
            isAvailable: true
        }).select("-password");

        res.status(200).json({
            success: true,
            count: riders.length,
            riders
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const assignRider = async (req, res) => {
    try {

        const { riderId } = req.body;

        if (!riderId) {
            return res.status(400).json({
                success: false,
                message: "riderId is required"
            });
        }

        // Find Rider
        const rider = await Rider.findById(riderId);

        if (!rider) {
            return res.status(404).json({
                success: false,
                message: "Rider not found"
            });
        }

        // Check availability
        if (!rider.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Rider is currently unavailable"
            });
        }

        // Find Order
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Assign rider
        order.assignedRider = rider._id;
        order.riderName = rider.name;
        order.riderPhone = rider.phone;

        // Save current rider location
        order.riderLocation = {
            lat: rider.currentLocation?.lat || null,
            lng: rider.currentLocation?.lng || null
        };

        // Rider assigned
        order.orderStatus = "Rider Assigned";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Rider assigned successfully",
            order
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getRiderOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            assignedRider: req.user.id,
            orderStatus: {
                $in: [
                    "Rider Assigned",
                    "Out For Delivery"
                ]
            }
        })
        .populate("address")
        .populate("user", "name email")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        console.error("Get Rider Orders Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateRiderLocation = async (req, res) => {
    try {

        const { lat, lng } = req.body;

        if (lat === undefined || lng === undefined) {
            return res.status(400).json({
                success: false,
                message: "lat and lng are required"
            });
        }

        const rider = await Rider.findById(req.user.id);

        if (!rider) {
            return res.status(404).json({
                success: false,
                message: "Rider not found"
            });
        }

        // Update Rider's current location
        rider.currentLocation = {
            lat,
            lng
        };

        await rider.save();

        // Also update active order location
        const order = await Order.findOne({
            _id: req.params.id,
            assignedRider: rider._id,
            orderStatus: "Out For Delivery"
        });

        if (order) {

            order.riderLocation = {
                lat,
                lng
            };

            await order.save();

        }

        res.status(200).json({
            success: true,
            message: "Location updated",
            location: rider.currentLocation
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// Rider: Mark order as delivered
const markOrderDelivered = async (req, res) => {
    try {

        const order = await Order.findOne({
            _id: req.params.id,
            assignedRider: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found or not assigned to you"
            });
        }

        order.orderStatus = "Delivered";

        // Payment status auto update (same as admin's updateOrderStatus)
        if (order.paymentMethod === "COD") {
            order.paymentStatus = "Paid";
        }

        await order.save();

        // Bump rider's delivery count
        await Rider.findByIdAndUpdate(req.user.id, {
            $inc: { totalDeliveries: 1 }
        });

        res.status(200).json({
            success: true,
            message: "Order marked as delivered",
            order
        });

    } catch (error) {

        console.error("Mark Delivered Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    markOrderDelivered,
    updateOrderStatus,
    assignRider,
    getRiderOrders,
    updateRiderLocation,
    getAllRiders
};
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

const createPaymentOrder = async (req, res) => {
    try {

        const { orderId } = req.body;

        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.paymentStatus === "Paid") {
            return res.status(400).json({
                success: false,
                message: "Order already paid"
            });
        }

        const options = {
            amount: order.totalPrice * 100,
            currency: "INR",
            receipt: order._id.toString()
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            razorpayOrder,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const verifyPayment = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });

        }

        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.paymentStatus = "Paid";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment Verified Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createPaymentOrder,
    verifyPayment
};
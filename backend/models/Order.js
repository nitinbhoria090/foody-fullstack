const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        name: String,

        image: String,

        price: Number,

        quantity: Number
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true
        },

        items: [orderItemSchema],

        totalItems: {
            type: Number,
            default: 0
        },

        totalPrice: {
            type: Number,
            default: 0
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            default: "COD"
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "Pending",
                "Preparing",
                "Out For Delivery",
                "Delivered",
                "Cancelled"
            ],
            default: "Pending"
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);
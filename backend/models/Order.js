// const mongoose = require("mongoose");

// const orderItemSchema = new mongoose.Schema(
//     {
//         product: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Product",
//             required: true
//         },

//         name: String,

//         image: String,

//         price: Number,

//         quantity: Number
//     },
//     {
//         _id: false
//     }
// );

// const orderSchema = new mongoose.Schema(
//     {
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },

//         address: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Address",
//             required: true
//         },

//         items: [orderItemSchema],

//         totalItems: {
//             type: Number,
//             default: 0
//         },

//         totalPrice: {
//             type: Number,
//             default: 0
//         },

//         paymentMethod: {
//             type: String,
//             enum: ["COD", "ONLINE"],
//             default: "COD"
//         },

//         paymentStatus: {
//             type: String,
//             enum: ["Pending", "Paid", "Failed"],
//             default: "Pending"
//         },

//         orderStatus: {
//             type: String,
//             enum: [
//                 "Pending",
//                 "Preparing",
//                 "Out For Delivery",
//                 "Delivered",
//                 "Cancelled"
//             ],
//             default: "Pending"
//         }, 

//         riderName: {
//     type: String,
//     default: null
// },

// riderPhone: {
//     type: String,
//     default: null
// },

//         riderName: {
//             type: String,
//             default: null
//         },

       

//         riderLocation: {
//             lat: { type: Number, default: null },
//             lng: { type: Number, default: null }
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// module.exports = mongoose.model("Order", orderSchema);



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
        // Customer
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Delivery Address
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true
        },

        // Ordered Products
        items: [orderItemSchema],

        totalItems: {
            type: Number,
            default: 0
        },

        totalPrice: {
            type: Number,
            default: 0
        },

        // Payment
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

        // Order Status
        orderStatus: {
            type: String,
            enum: [
                "Pending",
                "Preparing",
                "Rider Assigned",
                "Out For Delivery",
                "Delivered",
                "Cancelled"
            ],
            default: "Pending"
        },

        // =========================
        // RIDER INFORMATION
        // =========================

       assignedRider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rider",
    default: null
},

        riderName: {
            type: String,
            default: null
        },

        riderPhone: {
            type: String,
            default: null
        },

        riderLocation: {
            lat: {
                type: Number,
                default: null
            },

            lng: {
                type: Number,
                default: null
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);
// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//     },

//     category: {
//   type: String,
//   enum: ["veg", "non-veg"],
//   required: true,
// },

//     image: {
//       type: String,
//       default: "",
//     },

//     isAvailable: {
//       type: Boolean,
//       default: true,
//     },

//     rating: {
//       type: Number,
//       default: 0,
//     },

//     numReviews: {
//       type: Number,
//       default: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Product", productSchema);
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    // Veg / Non-Veg
    foodType: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },

    // Burger, Pizza, Pasta, Chinese...
    category: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Category"
},

    image: {
      type: String,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
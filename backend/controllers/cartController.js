const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add to Cart
const addToCart = async (req, res) => {
    try {

        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // Check Product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (!product.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Product is not available"
            });
        }

        // Find User Cart
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: []
            });
        }

        // Check if product already exists
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {

            cart.items[itemIndex].quantity += quantity || 1;

        } else {

            cart.items.push({
                product: productId,
                quantity: quantity || 1
            });

        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// Get User Cart
const getCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user.id
        }).populate({
            path: "items.product",
            populate: {
                path: "category",
                select: "name image"
            }
        });

        if (!cart) {
            return res.status(200).json({
                success: true,
                totalItems: 0,
                totalPrice: 0,
                cart: {
                    items: []
                }
            });
        }

        let totalItems = 0;
        let totalPrice = 0;

        cart.items.forEach(item => {

    if (!item.product) return;

    totalItems += item.quantity;

    totalPrice += item.quantity * item.product.price;

});

        res.status(200).json({
            success: true,
            totalItems,
            totalPrice,
            cart
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const updateCart = async (req, res) => {
    try {

        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === req.params.productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        item.quantity = quantity;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart Updated Successfully",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const removeFromCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product Removed Successfully",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const clearCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart Cleared Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeFromCart,
    clearCart
};


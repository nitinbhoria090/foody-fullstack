const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Product = require("../models/Product");
const Category = require("../models/Category");

// Add Product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check Category
        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        // Upload Image
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "food-delivery/products",
            resource_type: "image"
        });

        // Delete Local Image
        fs.unlinkSync(req.file.path);

        // Create Product
        const product = await Product.create({
            name,
            description,
            price,
            category,
            image: result.secure_url
        });

        res.status(201).json({
            success: true,
            message: "Product Added Successfully",
            product
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get All Products
const getProducts = async (req, res) => {
    try {

        const products = await Product.find()
            .populate("category", "name image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Product By ID
const getProductById = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id)
            .populate("category", "name image");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {

        if (req.body.category) {

            const categoryExists = await Category.findById(req.body.category);

            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
            }

        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("category", "name image");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
const Category = require("../models/Category");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const getPublicId = require("../utils/cloudinary");
const fs = require("fs");
const mongoose = require("mongoose");

// Add Category
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Category image is required" });
    }

    // Upload Image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "food-delivery/categories",
      resource_type: "image"
    });

    // Delete Local File
    fs.unlinkSync(req.file.path);

    const category = await Category.create({ name, image: result.secure_url });
    res.status(201).json({ success: true, message: "Category Added Successfully", category });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const id = req.params.id?.trim();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Invalid Category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (req.body.name) {
      category.name = req.body.name;
    }

    if (req.file) {
      if (category.image) {
        const publicId = getPublicId(category.image);
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "food-delivery/categories",
        resource_type: "image"
      });
      fs.unlinkSync(req.file.path);
      category.image = result.secure_url;
    }

    await category.save();
    res.status(200).json({ success: true, message: "Category Updated Successfully", category });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id?.trim();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Check if products exist
    const products = await Product.find({ category: category._id });
    if (products.length > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete category. Products are assigned to it." });
    }

    // Delete image from Cloudinary
    if (category.image) {
      const publicId = getPublicId(category.image);
      await cloudinary.uploader.destroy(publicId);
    }

    await category.deleteOne();
    res.status(200).json({ success: true, message: "Category Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addCategory, getCategories, updateCategory, deleteCategory };

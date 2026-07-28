const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // 👈 Ye line miss thi! Isse .env file load hoti hai.

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verification ke liye (dhyan rakhein production par API_SECRET print na karein)
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);

module.exports = cloudinary;
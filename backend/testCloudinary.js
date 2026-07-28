require("dotenv").config();
const cloudinary = require("./config/cloudinary");

(async () => {
  try {
    const result = await cloudinary.uploader.upload(
      "./uploads/1687335600000-pexels-pixabay-461198.jpg",
      {
        folder: "food-delivery/products",
        resource_type: "image",
      }
    );

    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();
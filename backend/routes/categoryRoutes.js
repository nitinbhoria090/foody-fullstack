const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

router.get("/", getCategories);

router.post(
    "/add",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    addCategory
);
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteCategory
);

module.exports = router;
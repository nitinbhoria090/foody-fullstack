const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress
} = require("../controllers/addressController");

router.post("/add", authMiddleware, addAddress);

router.get("/", authMiddleware, getAddresses);

router.put("/:id", authMiddleware, updateAddress);

router.delete("/:id", authMiddleware, deleteAddress);

module.exports = router;
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    registerRider,
    loginRider,
    getRiderProfile,
    updateAvailability,
    updateRiderLocation,
    getAvailableRiders,
    getRiderStats
} = require("../controllers/riderController");


// ==========================================
// PUBLIC ROUTES
// ==========================================

// Register rider
router.post(
    "/register",
    registerRider
);

// Rider login
router.post(
    "/login",
    loginRider
);


// ==========================================
// PROTECTED ROUTES
// ==========================================

// Get rider profile
router.get(
    "/profile",
    authMiddleware,
    getRiderProfile
);


// Update rider availability
router.put(
    "/availability",
    authMiddleware,
    updateAvailability
);


// Get rider statistics
router.get(
    "/stats",
    authMiddleware,
    getRiderStats
);


// Update rider current location
// IMPORTANT: No :id here
// Rider ID comes from JWT token
router.put(
    "/location",
    authMiddleware,
    updateRiderLocation
);


// Get available riders
router.get(
    "/available",
    authMiddleware,
    getAvailableRiders
);


module.exports = router;
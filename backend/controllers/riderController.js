const Rider = require("../models/Rider");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// REGISTER RIDER
// ===============================
const registerRider = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            vehicleType,
            vehicleNumber
        } = req.body;

        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !vehicleNumber
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingRider = await Rider.findOne({
            $or: [
                { email },
                { phone }
            ]
        });

        if (existingRider) {
            return res.status(400).json({
                success: false,
                message: "Rider already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const rider = await Rider.create({
            name,
            email,
            phone,
            password: hashedPassword,
            vehicleType: vehicleType || "Bike",
            vehicleNumber
        });

        res.status(201).json({
            success: true,
            message: "Rider registered successfully",
            rider: {
                id: rider._id,
                name: rider.name,
                email: rider.email,
                phone: rider.phone,
                vehicleType: rider.vehicleType,
                vehicleNumber: rider.vehicleNumber
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// RIDER LOGIN
// ===============================
const loginRider = async (req, res) => {
    try {

        const { email, password } = req.body;

        const rider = await Rider.findOne({ email });

        if (!rider) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            rider.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: rider._id,
                role: "rider"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Rider login successful",
            token,
            rider: {
                id: rider._id,
                name: rider.name,
                email: rider.email,
                phone: rider.phone,
                vehicleType: rider.vehicleType,
                vehicleNumber: rider.vehicleNumber,
                isAvailable: rider.isAvailable
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// GET RIDER PROFILE
// ===============================
const getRiderProfile = async (req, res) => {
    try {

        const rider = await Rider.findById(req.user.id)
            .select("-password");

        if (!rider) {
            return res.status(404).json({
                success: false,
                message: "Rider not found"
            });
        }

        res.status(200).json({
            success: true,
            rider
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// UPDATE RIDER AVAILABILITY
// ===============================
const updateAvailability = async (req, res) => {
    try {

        const { isAvailable } = req.body;

        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isAvailable must be true or false"
            });
        }

        const rider = await Rider.findById(req.user.id);

        if (!rider) {
            return res.status(404).json({
                success: false,
                message: "Rider not found"
            });
        }

        rider.isAvailable = isAvailable;

        await rider.save();

        res.status(200).json({
            success: true,
            message: isAvailable
                ? "You are now online"
                : "You are now offline",
            isAvailable: rider.isAvailable
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ===============================
// UPDATE RIDER LIVE LOCATION
// ===============================
const updateRiderLocation = async (req, res) => {
    try {

        const { lat, lng } = req.body;

        // Validate
        if (lat === undefined || lng === undefined) {
            return res.status(400).json({
                success: false,
                message: "lat and lng are required"
            });
        }

        const latitude = Number(lat);
        const longitude = Number(lng);

        // Check valid numbers
        if (
            Number.isNaN(latitude) ||
            Number.isNaN(longitude)
        ) {
            return res.status(400).json({
                success: false,
                message: "lat and lng must be valid numbers"
            });
        }


        // Find rider using JWT user ID
        const rider = await Rider.findById(req.user.id);

        if (!rider) {
            return res.status(404).json({
                success: false,
                message: "Rider not found"
            });
        }


        // Update rider location
        rider.currentLocation = {
            lat: latitude,
            lng: longitude
        };


        await rider.save();


        // Response
        res.status(200).json({
            success: true,
            message: "Location updated successfully",
            location: {
                lat: latitude,
                lng: longitude
            }
        });


    } catch (error) {

        console.error("Update Rider Location Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ===============================
// GET AVAILABLE RIDERS
// ===============================
const getAvailableRiders = async (req, res) => {
    try {

        const riders = await Rider.find({
            isAvailable: true
        })
        .select("-password");

        res.status(200).json({
            success: true,
            count: riders.length,
            riders
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



const getRiderStats = async (req, res) => {
    try {

        const rider = await Rider.findById(req.user.id)
            .select("-password");

        if (!rider) {
            return res.status(404).json({
                success: false,
                message: "Rider not found"
            });
        }

        // Active orders = Rider Assigned + Out For Delivery
        const activeOrders = await Order.countDocuments({
            assignedRider: rider._id,
            orderStatus: {
                $in: [
                    "Rider Assigned",
                    "Out For Delivery"
                ]
            }
        });

        // Delivered orders
        const deliveredOrders = await Order.countDocuments({
            assignedRider: rider._id,
            orderStatus: "Delivered"
        });

        res.status(200).json({
            success: true,
            stats: {
                totalDeliveries: rider.totalDeliveries || 0,
                rating: rider.rating || 0,
                activeOrders,
                deliveredOrders,
                isAvailable: rider.isAvailable,
                currentLocation: rider.currentLocation
            }
        });

    } catch (error) {

        console.error("Rider Stats Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerRider,
    loginRider,
    getRiderProfile,
    updateAvailability,
    updateRiderLocation,
    getAvailableRiders,
    getRiderStats
};
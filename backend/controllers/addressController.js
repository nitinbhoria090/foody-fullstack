const Address = require("../models/Address");
const geocodeAddress = require("../utils/geocode");

// Add Address
const addAddress = async (req, res) => {
    try {

        const {
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
            addressType,
            isDefault
        } = req.body;

        if (
            !fullName ||
            !phone ||
            !addressLine1 ||
            !city ||
            !state ||
            !postalCode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // Only one default address
        if (isDefault) {
            await Address.updateMany(
                { user: req.user.id },
                { isDefault: false }
            );
        }

        // Text address ko coordinates mein convert karo
        const { lat, lng } = await geocodeAddress({
            addressLine1,
            city,
            state,
            postalCode,
            country
        });

        const address = await Address.create({
            user: req.user.id,
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
            addressType,
            isDefault,
            lat,
            lng
        });

        res.status(201).json({
            success: true,
            message: "Address Added Successfully",
            address
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get User Addresses
const getAddresses = async (req, res) => {
    try {

        const addresses = await Address.find({
            user: req.user.id
        }).sort({
            isDefault: -1,
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: addresses.length,
            addresses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Update Address
const updateAddress = async (req, res) => {
    try {

        const address = await Address.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        if (req.body.isDefault) {
            await Address.updateMany(
                { user: req.user.id },
                { isDefault: false }
            );
        }

        // Agar address text change hua hai toh coordinates bhi update karo
        const addressChanged =
            req.body.addressLine1 || req.body.city || req.body.state || req.body.postalCode;

        if (addressChanged) {
            const { lat, lng } = await geocodeAddress({
                addressLine1: req.body.addressLine1 || address.addressLine1,
                city: req.body.city || address.city,
                state: req.body.state || address.state,
                postalCode: req.body.postalCode || address.postalCode,
                country: req.body.country || address.country
            });

            req.body.lat = lat;
            req.body.lng = lng;
        }

        Object.assign(address, req.body);

        await address.save();

        res.status(200).json({
            success: true,
            message: "Address Updated Successfully",
            address
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Delete Address
const deleteAddress = async (req, res) => {
    try {

        const address = await Address.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        await address.deleteOne();

        res.status(200).json({
            success: true,
            message: "Address Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress
};
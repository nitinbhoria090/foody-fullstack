const axios = require("axios");

// Text address ko lat/lng mein convert karta hai (OpenStreetMap Nominatim — free, no API key)
const geocodeAddress = async ({ addressLine1, city, state, postalCode, country }) => {
    try {
        const query = encodeURIComponent(
            `${addressLine1}, ${city}, ${state}, ${postalCode}, ${country || "India"}`
        );

        const res = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
            { headers: { "User-Agent": "fooddelivery-app" } }
        );

        if (res.data && res.data.length > 0) {
            return {
                lat: parseFloat(res.data[0].lat),
                lng: parseFloat(res.data[0].lon)
            };
        }

        return { lat: null, lng: null };

    } catch (error) {
        console.log("Geocoding failed:", error.message);
        return { lat: null, lng: null };
    }
};

module.exports = geocodeAddress;
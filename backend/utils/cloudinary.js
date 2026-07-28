const getPublicId = (imageUrl) => {
    if (!imageUrl) return "";

    const parts = imageUrl.split("/upload/")[1];

    if (!parts) return "";

    const publicId = parts
        .replace(/^v\d+\//, "")
        .replace(/\.[^/.]+$/, "");

    return publicId;
};

module.exports = getPublicId;
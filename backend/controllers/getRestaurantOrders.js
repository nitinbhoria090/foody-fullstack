const getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.user._id })
      .populate("items.food")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

module.exports = { ... getRestaurantOrders };
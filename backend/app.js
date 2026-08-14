const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const riderRoutes = require("./routes/riderRoutes");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());




app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);




app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);



app.use("/api/cart", cartRoutes);




app.use("/api/address", addressRoutes);



app.use("/api/orders", orderRoutes);




app.use("/api/payment", paymentRoutes);




app.use("/api/riders", riderRoutes);


module.exports = app;
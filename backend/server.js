require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();


app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
app.use((err, req, res, next) => {
    console.error("ERROR =>", err);

    res.status(500).json({
        success: false,
        message: err.message,
        stack: err.stack
    });
});
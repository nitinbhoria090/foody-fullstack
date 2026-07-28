const mongoose = require("mongoose");
const dns = require("dns"); // 👈 1. DNS module import karo

// 🟢 2. Google DNS server force karo
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Error\n${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
const User = require("../models/User"); 
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 

const registerUser = async (req, res) => { 
    try { 
        const { name, email, password } = req.body; 

        if (!name || !email || !password) { 
            return res.status(400).json({ success: false, message: "Please provide all required fields" }); 
        } 

        const existingUser = await User.findOne({ email }); 
        if (existingUser) { 
            return res.status(400).json({ success: false, message: "Email already registered" }); 
        } 

        const hashedPassword = await bcrypt.hash(password, 10); 
        const user = await User.create({ name, email, password: hashedPassword }); 

        res.status(201).json({ 
            success: true, 
            message: "User Registered Successfully", 
            user: { id: user._id, name: user.name, email: user.email } 
        }); 
    } catch (error) { 
        res.status(500).json({ success: false, message: "Server Error", error: error.message }); 
    } 
}; 

const loginUser = async (req, res) => { 
    try { 
        const { email, password } = req.body; 

        if (!email || !password) { 
            return res.status(400).json({ success: false, message: "Email and password are required" }); 
        } 

        const user = await User.findOne({ email }); 
        if (!user) { 
            return res.status(400).json({ success: false, message: "User not found" }); 
        } 

        // FIX 1: Fixed typo from 'user.passwor' to 'user.password'
        const isMatch = await bcrypt.compare(password, user.password); 
        if (!isMatch) { 
            // FIX 2: Fixed typo from 'sucess' to 'success'
            return res.status(401).json({ success: false, message: "Invalid Password" }); 
        } 

        // FIX 3: Fixed typo from 'user._role' to 'user.role'
        const token = jwt.sign( 
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "7d" } 
        ); 

        res.status(200).json({ 
            success: true, 
            message: "Login successfully", 
            token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        }); 
    } catch (error) { 
        res.status(500).json({ success: false, message: "Server Error", error: error.message }); 
    } 
}; 

module.exports = { registerUser, loginUser };

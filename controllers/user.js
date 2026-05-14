import User from "../models/user.js";
import { v4 as uuidv4 } from 'uuid';
import { setUser, getUser } from "../services/auth.js";

export async function handleUserSignUp(req, res) {
    const { name, email, password } = req.body;
    
    try {
        await User.create({
            name,
            email,
            password,
        });
        return res.redirect("/");
    } catch (error) {
        // FIX: Handle the duplicate email error gracefully instead of crashing into the 500 block
        if (error.code === 11000) {
            console.warn(`Signup rejected: ${email} already exists.`);
            return res.render("signup", {
                error: "Email already registered. Try logging in."
            });
        }
        console.error("Signup database insertion failed:", error);
        return res.status(500).send("Internal Server Error");
    }
}

export async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render("login", { error: "Invalid Email or Password" });
        }

        if (user.password !== password) {
            return res.render("login", { error: "Invalid Email or Password" });
        }
        
        const sessionId = uuidv4();
        setUser(sessionId, user);
        res.cookie('uid', sessionId);
        
        return res.redirect("/");
    } catch (error) {
        console.error("Login authentication process failed:", error);
        return res.status(500).send("Internal Server Error");
    }
}

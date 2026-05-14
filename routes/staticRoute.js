import Express from "express";
import URLModel from "../models/url.js"; 

const router = Express.Router();

// 1. Renders the home page with all shortened URLs
router.get("/", async (req, res) => {
    try {
        const allurls = await URLModel.find({}); 
        return res.render("home", {
            urls: allurls,
        });
    } catch (error) {
        console.error("Database fetch failed:", error);
        return res.render("home", { urls: [] });
    }
});

// 2. Renders the signup page form layout
router.get("/signup", (req, res) => {
    return res.render("signup"); 
});

// FIX: Added a route to render the login page form layout
router.get("/login", (req, res) => {
    return res.render("login"); 
});

// 3. Handles short URL generation form submissions
router.post("/", async (req, res) => {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "url is required" });
    
    const shortID = Math.random().toString(36).substring(2, 10); 
    
    await URLModel.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

    const allUrls = await URLModel.find({});
    return res.render("home", { id: shortID, urls: allUrls });
});

export default router;

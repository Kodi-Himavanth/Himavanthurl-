import { getUser } from "../services/auth.js";

export async function restictToLoggedinUserOnly(req, res, next) {
    // FIX: Fallback to an empty object if cookies parser failed or is absent
    const cookies = req.cookies || {}; 
    const userUid = cookies.uid;

    if (!userUid) {
        return res.redirect("/login");
    }

    // Replace this with your actual getUser / validation logic
    const user = getUser(userUid); 
    if (!user) {
        return res.redirect("/login");
    }

    req.user = user;
    next();
}

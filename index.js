import Express from "express";
import path from "path";
// FIX 1: Import the cookie-parser library
import cookieParser from "cookie-parser";

import urlRoute from "./routes/url.js";
import connectToMongoDB from "./connection.js";
import { restictToLoggedinUserOnly } from "./middlewares/auth.js";

import URLModel from "./models/url.js"; 
import staticRoute from "./routes/staticRoute.js"; 
import userRoute from "./routes/user.js";

const app = Express(); 
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
    .then(() => console.log("mongodb connection started"));

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

app.use(Express.json());
app.use(Express.urlencoded({ extended: false })); 
app.use(cookieParser()); 
// FIX 2: Mount cookie-parser so res.cookie() works during login
app.use(cookieParser());

app.get("/test", async (req, res) => {
    const allUrl = await URLModel.find({});
    return res.render('home', { urls: allUrl });
});

app.use("/url",restictToLoggedinUserOnly,  urlRoute);
app.use("/", staticRoute); 
app.use("/user", userRoute); 

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    
    const entry = await URLModel.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: { timestamp: Date.now() }
            }
        }
    );

    if (!entry) return res.status(404).send("Not Found");

    let targetUrl = entry.redirectURL;
    if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = `https://${targetUrl}`;
    }

    res.redirect(targetUrl);
});

app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));

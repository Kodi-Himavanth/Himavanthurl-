import  express  from "express";
import {handlegenerateNewShortURL,handleGetAnalytics} from "../controllers/url.js"
const router = express.Router();

router.post("/",handlegenerateNewShortURL);


router.get('/anlytics/:shortId',handleGetAnalytics);

export default router;
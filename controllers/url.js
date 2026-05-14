// import  {nanoid}  from "nanoid"

// import URL from "../models/url.js";


// async function  handlegenerateNewShortURL(req,res){
//     const body = req.body;
//     if(!body || !body.url) return res.status(400).json({error:"url is required"})
//  const shortID = nanoid(8);
//  await URL.create({
//     shortId:shortID,
//     redirectURL:body.URL,
//     visitHistory:[],
//  });
//   return res.json({id:shortID});
// }

// export default    handlegenerateNewShortURL;


import { nanoid } from "nanoid";
import URL from "../models/url.js";

async function handlegenerateNewShortURL(req, res) {
    const body = req.body;
    
    // ✅ Fixed: Changed body.URL to lowercase body.url to match your Postman payload
    if (!body || !body.url) {
        return res.status(400).json({ error: "url is required" });
    }
    
    const shortID = nanoid(8);
    
    await URL.create({
        shortId: shortID,
        // ✅ Fixed: Changed body.URL to lowercase body.url
        redirectURL: body.url, 
        visitHistory: [],
    }); 
    
    return res.render("home",{
        id:shortID,
    });
    // return res.json({ id: shortID });

  
}



async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URLModel.findOne({ shortId });
    

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}
export {
    handlegenerateNewShortURL,
    handleGetAnalytics,
}

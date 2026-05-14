import Express from "express";
// FIX: Added curly braces around handleUserSignUp to match the named export
import { handleUserSignUp,handleUserLogin } from "../controllers/user.js";

const router = Express.Router();

router.post("/", handleUserSignUp);

router.post("/login", handleUserLogin);


export default router;

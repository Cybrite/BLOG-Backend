import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser, loginUser } from "../controllers/user.controller.js";

const router = Router();

export default router;

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// protected routes

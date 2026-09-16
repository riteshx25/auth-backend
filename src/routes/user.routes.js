import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

router.route("/login").post(loginUser);

// secure routes
router.route("/logout").post(verifyJwt, logout);
export default router;

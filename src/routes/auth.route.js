import express from "express";
import authController from "../controllers/auth.controller";
import multer from "multer";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/** patch to authorize Identity Card **/
router.patch("/idcard", upload.single("imageData"), authController.patchIdcard);

/** post for register password **/
router.post("/register/password", authController.postPassword);

/** patch to authorize password **/
router.patch("/login", authController.patchLogin);

/** check for token expires **/
router.post("/check", authController.check);

module.exports = router;

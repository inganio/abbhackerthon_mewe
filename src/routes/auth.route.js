import express from "express";
import authController from "../controllers/auth.controller";
const router = express.Router();

/** patch to authorize Identity Card **/
router.patch("/idcard", authController.patchIdcard);

/** post for register password **/
router.post("/register/password", authController.postPassword);

/** patch to authorize password **/
router.patch("/login", authController.patchLogin);

/** check for token expires **/
router.post("/check", authController.check);

module.exports = router;

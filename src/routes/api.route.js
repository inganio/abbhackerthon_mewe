import express from "express";
import checkJWT from "../middlewares/checkJWT.middleware";
import apiController from "../controllers/api.controller";
import multer from "multer";

const router = express.Router();
router.use(checkJWT.check);

// Create
//
/** create opinions **/
router.post("/opinions", apiController.post);

// Read
//
/** get proceeding opinions **/
router.get("/proceeding/opinions", apiController.getProceeding);

/** get all opinions **/
router.get("/opinions", apiController.getAll);

/** get my opinions **/
router.get("/my/opinions", apiController.getMyOpinion);

// Update
//
/** update opinions **/
router.put("/opinions", apiController.put);

// Delete
//
/** delete opinions **/
router.delete("/opinions", apiController.deleteMy);

module.exports = router;

import { Router } from "express";
import * as controller from "../controllers/InterestController.js";

const router = Router();

router.post("/", controller.createInterest);
router.get("/", controller.getAllInterest);
router.get("/:id", controller.getInterestById);

export default router;
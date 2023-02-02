import { Router } from "express";
import * as controller from "../controllers/PostController.js";

const router = Router();

router.post("/", controller.createPost);
router.get("/", controller.getAllPosts);
router.get("/:id", controller.getPostById);
router.get("/user/:id", controller.getPostByUser);
router.post("/feed", controller.getFeedPosts);
router.put("/:id", controller.updatePost);
router.delete("/:id", controller.deletePost);

// Reaction to post actions
router.post("/:id/reaction", controller.setReactionPost);
router.get("/:id/reaction", controller.getReactionPost);

export default router;

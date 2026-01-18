import express, { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { authMiddlware } from "../../middleware/auth";
import { postController } from "./post.controller";

const router = express.Router();

router.get("/", postController.getAllPost);
router.get(
  "/my-post",
  authMiddlware(UserRole.USER, UserRole.ADMIN),
  postController.getMyPosts,
);

router.get("/:id", postController.getPostById);

router.post("/", authMiddlware(UserRole.USER), postController.createPost);
router.put(
  "/:postId",
  authMiddlware(UserRole.USER, UserRole.ADMIN),
  postController.updatePost,
);
router.delete(
  "/:postId",
  authMiddlware(UserRole.USER, UserRole.ADMIN),
  postController.deletePost,
);

export const postRouter: Router = router;

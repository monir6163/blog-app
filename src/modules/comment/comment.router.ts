import express, { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { authMiddlware } from "../../middleware/auth";
import { commentController } from "./comment.controller";

const router = express.Router();

router.get("/author/:authorId", commentController.getCommentsByAuthorId);
router.get("/:commnentId", commentController.getCommentById);

router.post(
  "/",
  authMiddlware(UserRole.USER, UserRole.ADMIN),
  commentController.createComment,
);

router.delete(
  "/:commentId",
  authMiddlware(UserRole.USER, UserRole.ADMIN),
  commentController.commentDelete,
);
router.patch(
  "/:commentId",
  authMiddlware(UserRole.USER, UserRole.ADMIN),
  commentController.updateCommnent,
);
router.patch(
  "/moderate/:commentId",
  authMiddlware(UserRole.ADMIN),
  commentController.moderateCommnent,
);

export const commentRouter: Router = router;

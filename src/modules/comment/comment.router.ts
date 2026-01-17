import express, { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { authMiddlware } from "../../middleware/auth";
import { commentController } from "./comment.controller";

const router = express.Router();

router.post(
  "/",
  authMiddlware(UserRole.USER, UserRole.ADMIN),
  commentController.createComment
);

export const commentRouter: Router = router;

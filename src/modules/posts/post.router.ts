import express, { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { authMiddlware } from "../../middleware/auth";
import { postController } from "./post.controller";

const router = express.Router();

router.get("/", postController.getAllPost);

router.get("/:id", postController.getPostById);

router.post("/", authMiddlware(UserRole.USER), postController.createPost);

export const postRouter: Router = router;

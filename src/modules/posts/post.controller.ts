import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;
    bodyData.authorId = req.user?.id;
    const result = await postService.createPost(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const postController = { createPost };

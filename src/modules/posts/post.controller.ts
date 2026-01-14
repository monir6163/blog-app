import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;
    bodyData.authorId = req.user?.id;
    const result = await postService.createPost(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.getAllPost();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: "post get failed" });
  }
};

export const postController = { createPost, getAllPost };

import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;
    bodyData.authorId = req.user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to comment post" });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commnentId } = req.params;
    const result = await commentService.getCommentById(commnentId);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to comment fetched", details: error });
  }
};

export const commentController = {
  createComment,
  getCommentById,
};

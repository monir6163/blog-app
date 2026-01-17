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
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to comment fetched", details: error });
  }
};

const getCommentsByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await commentService.getCommentsByAuthorId(authorId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to comment fetched", details: error });
  }
};

const commentDelete = async (req: Request, res: Response) => {
  try {
    const authorId = req.user?.id as string;
    const { commentId } = req.params;
    const result = await commentService.commentDelete(authorId, commentId);
    res.status(200).json({
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
  getCommentsByAuthorId,
  commentDelete,
};

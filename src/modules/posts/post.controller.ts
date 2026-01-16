import { Request, Response } from "express";
import paginationSortingHelper from "../../helpers/paginationSorting";
import { Payload } from "./interface.types";
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
    const { s, tags, isFeatured, status, authorId } = req.query;
    const tag =
      typeof tags === "string" && tags.length > 0 ? tags.split(",") : undefined;
    const isFeature = isFeatured
      ? isFeatured === "true"
        ? true
        : isFeatured === "false"
        ? false
        : undefined
      : undefined;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );
    const result = await postService.getAllPost({
      s,
      tag,
      isFeature,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    } as Payload);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log("e", error);
    res.status(500).json({ success: false, error: "post get failed" });
  }
};

export const postController = { createPost, getAllPost };

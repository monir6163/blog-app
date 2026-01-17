import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { buildPostQueryCondition } from "../../utils/postQueryCondition";
import { Payload } from "./interface.types";
const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">
) => {
  const result = await prisma.post.create({
    data,
  });
  return result;
};

const getAllPost = async (payload: Payload) => {
  const result = await prisma.post.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: buildPostQueryCondition(payload),
    orderBy: { [payload.sortBy]: payload.sortOrder },
  });
  const total = await prisma.post.count({
    where: buildPostQueryCondition(payload),
  });
  return {
    data: result,
    pagination: {
      total,
      page: payload.page,
      limit: payload.limit,
      totalPages: payload.totalPages,
    },
  };
};

export const postService = { createPost, getAllPost };

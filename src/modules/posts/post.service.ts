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
  const skip = (payload.page - 1) * payload.limit;
  const result = await prisma.post.findMany({
    take: payload.limit,
    skip: skip,
    where: buildPostQueryCondition(payload),
    orderBy:
      payload.sortBy && payload.sortOrder
        ? {
            [payload.sortBy]: payload.sortOrder,
          }
        : { created_at: "desc" },
  });
  return result;
};

export const postService = { createPost, getAllPost };

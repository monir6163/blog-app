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

const getPostById = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        post_id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        post_id: id,
      },
    });
    return postData;
  });

  return result;
};

export const postService = { createPost, getAllPost, getPostById };

import { CommentStatus, Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { buildPostQueryCondition } from "../../utils/postQueryCondition";
import { Payload } from "./interface.types";
const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">,
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
    include: {
      _count: {
        select: { comments: true },
      },
    },
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
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { created_at: "desc" },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: { created_at: "asc" },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                  orderBy: { created_at: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return postData;
  });

  return result;
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: { authorId: authorId },
    include: {
      comments: {
        include: {
          replies: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
  return result;
};

export const postService = { createPost, getAllPost, getPostById, getMyPosts };

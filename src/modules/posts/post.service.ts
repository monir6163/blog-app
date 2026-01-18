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
  const userStatus = await prisma.user.findUniqueOrThrow({
    where: { id: authorId },
    select: {
      id: true,
      status: true,
    },
  });
  if (userStatus.status !== "ACTIVE") {
    throw new Error("User not ACTIVE!");
  }
  const result = await prisma.post.findMany({
    where: { authorId: authorId },
    include: {
      comments: {
        include: {
          replies: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
  const total = await prisma.post.count({ where: { authorId } });
  return { total, result };
};

const updatePost = async (
  authorId: string,
  postId: string,
  postData: Partial<Post>,
  isAdmin: boolean,
) => {
  const findPost = await prisma.post.findUnique({
    where: { post_id: postId },
  });
  if (!isAdmin && findPost?.authorId !== authorId) {
    throw new Error("this post not your!");
  }
  if (!isAdmin) {
    delete postData.isFeatured;
  }
  const result = await prisma.post.update({
    where: { post_id: findPost?.post_id, authorId: findPost?.authorId },
    data: postData,
  });
  return result;
};

const deletePost = async (
  authorId: string,
  postId: string,
  isAdmin: boolean,
) => {
  const findPost = await prisma.post.findFirstOrThrow({
    where: { post_id: postId },
  });
  if (!isAdmin && findPost?.authorId !== authorId) {
    throw new Error("this post not your!");
  }
  const result = await prisma.post.delete({
    where: { post_id: findPost.post_id },
  });
  return result;
};

export const postService = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
};

import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IComments } from "./commnet.interface";

const createComment = async (payload: IComments) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      post_id: payload.post_id,
    },
  });
  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: { comment_id: payload.parentId },
    });
  }
  const result = await prisma.comment.create({
    data: payload,
  });
  return result;
};

const getCommentById = async (commnentId: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      comment_id: commnentId,
    },
    include: {
      post: {
        select: {
          post_id: true,
          title: true,
          views: true,
          isFeatured: true,
          created_at: true,
          updated_at: true,
        },
      },
    },
  });
  return result;
};

const getCommentsByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
    include: {
      post: {
        select: {
          post_id: true,
          title: true,
          created_at: true,
          updated_at: true,
        },
      },
      replies: true,
    },
  });
  return result;
};

const commentDelete = async (authorId: string, commentId: string) => {
  const findComment = await prisma.comment.findFirst({
    where: {
      comment_id: commentId,
      authorId: authorId,
    },
    include: {
      post: {
        select: {
          post_id: true,
          title: true,
        },
      },
    },
  });
  if (!findComment) {
    throw new Error("comment not found!");
  }
  const result = await prisma.comment.delete({
    where: {
      comment_id: findComment.comment_id,
      authorId: findComment.authorId,
    },
  });
  return result;
};

const updateCommnent = async (
  authorId: string,
  commentId: string,
  commentData: {
    content?: string;
    status?: CommentStatus;
  },
) => {
  const findComment = await prisma.comment.findFirst({
    where: {
      comment_id: commentId,
      authorId: authorId,
    },
    include: {
      post: {
        select: {
          post_id: true,
          title: true,
        },
      },
    },
  });
  if (!findComment) {
    throw new Error("comment not found!");
  }
  const result = await prisma.comment.update({
    where: {
      comment_id: commentId,
      authorId: authorId,
    },
    data: {
      content: commentData.content,
      status: commentData.status,
    },
  });

  return result;
};
const moderateCommnent = async (
  commentId: string,
  commentData: {
    status?: CommentStatus;
  },
) => {
  const findComment = await prisma.comment.findFirstOrThrow({
    where: {
      comment_id: commentId,
    },
    select: {
      content: true,
      status: true,
    },
  });
  if (findComment.status === commentData.status) {
    throw new Error("your comment status already up to date");
  }
  const result = await prisma.comment.update({
    where: {
      comment_id: commentId,
    },
    data: {
      status: commentData.status,
    },
  });

  return result;
};

export const commentService = {
  createComment,
  getCommentById,
  getCommentsByAuthorId,
  commentDelete,
  updateCommnent,
  moderateCommnent,
};

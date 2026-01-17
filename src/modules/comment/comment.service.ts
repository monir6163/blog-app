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

export const commentService = {
  createComment,
};

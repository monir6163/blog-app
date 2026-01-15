import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
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
    where: {
      OR: [
        {
          title: {
            contains: payload.s,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload.s,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: { created_at: "desc" },
  });
  return result;
};

export const postService = { createPost, getAllPost };

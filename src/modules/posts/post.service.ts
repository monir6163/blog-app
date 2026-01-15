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
      title: {
        contains: payload.s,
        mode: "insensitive",
      },
    },
  });
  return result;
};

export const postService = { createPost, getAllPost };

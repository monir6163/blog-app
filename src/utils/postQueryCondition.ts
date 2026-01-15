import { PostWhereInput } from "../../generated/prisma/models";
import { Payload } from "../modules/posts/interface.types";

export const buildPostQueryCondition = (payload: Payload) => {
  const andConditions: PostWhereInput[] = [];

  // Search filter
  if (payload.s) {
    andConditions.push({
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
        {
          tags: {
            has: payload.s,
          },
        },
      ],
    });
  }
  // Tag filter
  if (payload.tag && payload.tag.length > 0) {
    andConditions.push({
      tags: {
        hasSome: payload.tag,
      },
    });
  }
  // isFeature filter
  if (typeof payload.isFeature === "boolean") {
    andConditions.push({
      isFeatured: payload.isFeature,
    });
  }

  return andConditions.length > 0 ? { AND: andConditions } : {};
};

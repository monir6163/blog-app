import { PostStatus } from "../../../generated/prisma/enums";

export interface Payload {
  s?: string | undefined;
  tag?: string[];
  isFeature?: boolean | undefined;
  status?: PostStatus | undefined;
  authorId?: string | undefined;
  page: number;
  limit: number;
}

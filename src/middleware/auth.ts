import { fromNodeHeaders } from "better-auth/node";
import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums";
import { auth } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
        image: string;
        phone: string;
      };
    }
  }
}

export const authMiddlware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = fromNodeHeaders(req.headers);
      const session = await auth.api.getSession({ headers });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Your email not verified! Please verify email",
        });
      }
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
        image: session.user.image as string,
        phone: session.user.phone as string,
      };
      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message: "Access Forbidden! You don't have permission.",
        });
      }
      next();
    } catch (error) {
      console.error("Error in user middleware:", error);
      req.user = undefined;
      next();
    }
  };
};

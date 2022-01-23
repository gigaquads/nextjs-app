// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from "next";
import nc from "next-connect";
import ApiRequest from "../../lib/next/Request";
import ApiResponse from "../../lib/next/Response";
import { withPrisma, withSession } from "../../lib/next/middleware";
import { PublicUser } from "../../lib/prisma";

export const config = {};

/**
 * Return the current session user's public data.
 */
export default nc<ApiRequest, ApiResponse<PublicUser>>()
  .use(withSession)
  .use(withPrisma)
  .get(async (req: ApiRequest, res: NextApiResponse<PublicUser>) => {
    if (!req.session!.isAuthenticated) {
      res.status(401).end();
      return;
    }
    const userId = req.session!.user?.id;
    const user = userId ? await req.prisma!.getUserById(userId) : null;
    if (user === null) {
      res.status(401).end();
      return;
    } else {
      res.json({
        id: user.id,
        email: user.email!,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
  });

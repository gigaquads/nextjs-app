import minio from "../minio";
import prisma from "../prisma";
import { getSession } from "next-auth/react";
import Request from "./Request";
import Response from "./Response";
import Schema from "../Schema";
import { Middleware } from "next-connect";

/**
 * Middleware that adds singleton minio client to the request.
 */
export async function withMinio<T>(req: Request, res: Response<T>, next: any) {
  req.minio = minio;
  next();
}

/**
 * Middleware that adds the singleton prisma client to the request.
 */
export async function withPrisma<T>(req: Request, res: Response<T>, next: any) {
  req.prisma = prisma;
  next();
}

type WithSessionArgs = {
  loginRequired: boolean | undefined;
};

/**
 * Middleware that adds the auth session to the request.
 */
export function withSession<T>(
  params: WithSessionArgs
): Middleware<Request, Response<T>> {
  return async (req: Request, res: Response<T>, next: any) => {
    req.session = await getSession({ req });
    if (params.loginRequired && !(req.session && req.session.user)) {
      res.status(401).end("login required");
      return;
    }
    next();
  };
}

type WithBodyValidationArgs = {
  [key: string]: Schema | null | undefined;
  post?: Schema | null | undefined;
  put?: Schema | null | undefined;
  get?: Schema | null | undefined;
  patch?: Schema | null | undefined;
  delete?: Schema | null | undefined;
};

/**
 * Middleware that applies schema to request body.
 */
export function withBodyValidation<T>(
  args: WithBodyValidationArgs
): Middleware<Request, Response<T>> {
  // normalize keys in args lowercase
  args = Object.fromEntries(
    Object.entries(args).map(([k, v]) => [k.toLowerCase(), v])
  );
  return async (req: Request, res: Response<T>, next: any) => {
    if (req.method) {
      const method = (req.method as string).toLowerCase();
      const schema = args[method];
      if (schema) {
        const { data: newBody, errors } = schema.validate(req.body);
        if (errors) {
          res.status(400).json(errors);
          return;
        }
        req.body = newBody;
        next();
      } else {
        res.status(400).end("unrecognized request body");
        return;
      }
    }
  };
}

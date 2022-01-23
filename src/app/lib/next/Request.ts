import { NextApiRequest } from "next";
import { Session } from "next-auth";
import { MinioHelper } from "../minio";
import { CustomPrismaClient } from "../prisma";
import mailgun, { MailgunEmailClient } from "../mailgun";

export default interface ApiRequest extends NextApiRequest {
  session?: Session | null;
  minio?: MinioHelper | null;
  prisma?: CustomPrismaClient | null;
  mailgun?: MailgunEmailClient | null;
}

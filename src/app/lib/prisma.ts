import { PrismaClient, User } from "@prisma/client";

export type PublicUser = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export class CustomPrismaClient extends PrismaClient {
  async getUserById(userId: string): Promise<User | null> {
    const user = await this.user.findUnique({
      where: { id: userId },
    });
    return user !== null ? (user as User) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return user !== null ? (user as User) : null;
  }
}

export default new CustomPrismaClient();

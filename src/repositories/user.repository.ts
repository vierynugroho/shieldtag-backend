import prisma from '@/db';

export class UserRepository {
  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        Role: true,
      },
    });
  }

  static async findByUserId(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Role: true,
      },
    });
  }
}

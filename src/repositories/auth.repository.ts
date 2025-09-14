import prisma from '@/db';

export class AuthRepository {
  static async register(email: string, name: string, hashedPassword: string, roleId: string) {
    return await prisma.$transaction(async db => {
      const user = await db.user.create({
        data: {
          email: email,
          name: name,
          password: hashedPassword,
          roleId: roleId,
        },
      });

      return user;
    });
  }
}

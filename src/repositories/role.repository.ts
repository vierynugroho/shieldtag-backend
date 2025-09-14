import prisma from '@/db';
import { RoleName } from '@/generated/prisma';

export class RoleRepository {
  static async getAllRoles() {
    return await prisma.role.findMany();
  }

  static async getRoleById(roleId: string) {
    return await prisma.role.findUnique({
      where: { id: roleId },
    });
  }

  static async getRoleByName(name: string) {
    return await prisma.role.findUnique({
      where: { name: name as RoleName },
    });
  }
}

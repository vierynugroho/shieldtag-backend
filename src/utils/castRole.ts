import { RoleName } from '@/generated/prisma';

export function castRoleToUserRole(role: string): RoleName {
  return role as RoleName;
}

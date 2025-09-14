import { PasswordUtils } from './../../src/utils/password';
import prisma from '../../src/db';
import fs from 'fs';
import path from 'path';

async function main() {
  // Load roles and permissions from roles.json
  const rolesPath = path.resolve(__dirname, '../../src/config/roles.json');
  const rolesData = JSON.parse(fs.readFileSync(rolesPath, 'utf-8'));

  // Collect all unique permissions from roles.json
  const permissionSet = new Set<string>();
  for (const role of rolesData.roles) {
    for (const perm of role.permissions) {
      permissionSet.add(perm);
    }
  }
  const perms = Array.from(permissionSet).map(name => ({
    name,
    description: name.replace(/:/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  }));

  // Upsert all permissions
  for (const p of perms) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  // Upsert all roles and assign permissions
  for (const role of rolesData.roles) {
    const dbRole = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: {
        name: role.name,
        description: `${role.name.charAt(0).toUpperCase() + role.name.slice(1)} role`,
      },
    });

    // Assign permissions to role
    for (const permName of role.permissions) {
      const perm = await prisma.permission.findUnique({ where: { name: permName } });
      if (perm) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: dbRole.id, permissionId: perm.id } },
          update: {},
          create: { roleId: dbRole.id, permissionId: perm.id },
        });
      }
    }
  }

  // Create a sample superadmin user and assign superadmin role
  const superRole = await prisma.role.findUnique({ where: { name: 'superadmin' } });
  if (superRole) {
    await prisma.user.upsert({
      where: { email: 'superadmin@mail.com' },
      update: {},
      create: {
        email: 'superadmin@mail.com',
        password: await PasswordUtils.hash('password'),
        name: 'Super Admin',
        roleId: superRole.id,
      },
    });
  }

  console.log('Seed selesai');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

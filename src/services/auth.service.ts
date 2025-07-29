import {
  LoginInput,
  RegisterInput,
  User,
  UserResponse,
  AuthResponse,
  UserRole,
} from '@/types/user';
import { PasswordUtils } from '@/utils/password';
import { generateTokens } from '@/utils/jwt';
import logger from '@/utils/logger';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

function castRoleToUserRole(role: string): UserRole {
  return role as UserRole;
}

export class AuthService {
  static async register(userData: RegisterInput): Promise<AuthResponse> {
    try {
      const existing = await db.select().from(users).where(eq(users.email, userData.email));
      if (existing.length > 0) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await PasswordUtils.hash(userData.password);

      const [newUserRaw] = await db
        .insert(users)
        .values({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role!,
        })
        .returning();

      const newUser: User = {
        ...newUserRaw,
        role: castRoleToUserRole(newUserRaw.role),
      };

      const tokens = generateTokens({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions,
      });

      const userResponse = this.sanitizeUser(newUser);

      logger.info('User registered successfully', {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });

      return {
        user: userResponse,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      logger.error('Registration failed', {
        email: userData.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  static async login(credentials: LoginInput): Promise<AuthResponse> {
    try {
      // Cari user berdasarkan email
      const found = await db.select().from(users).where(eq(users.email, credentials.email));
      const userRaw = found[0];
      if (!userRaw) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await PasswordUtils.compare(credentials.password, userRaw.password!);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Convert role from string to UserRole
      const user: User = {
        ...userRaw,
        role: castRoleToUserRole(userRaw.role),
      };

      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      });

      const userResponse = this.sanitizeUser(user);

      logger.info('User logged in successfully', {
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user: userResponse,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      logger.error('Login failed', {
        email: credentials.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  static async getUserById(userId: string): Promise<UserResponse | null> {
    try {
      const found = await db.select().from(users).where(eq(users.id, userId));
      const userRaw = found[0];
      if (!userRaw) {
        return null;
      }

      // Convert role from string to UserRole
      const user: User = {
        ...userRaw,
        role: castRoleToUserRole(userRaw.role),
      };

      return this.sanitizeUser(user);
    } catch (error) {
      logger.error('Failed to get user by ID', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  static async getUserProfile(userId: string): Promise<UserResponse> {
    try {
      const found = await db.select().from(users).where(eq(users.id, userId));
      const userRaw = found[0];
      if (!userRaw) {
        throw new Error('User not found');
      }
      // Convert role from string to UserRole
      const user: User = {
        ...userRaw,
        role: castRoleToUserRole(userRaw.role),
      };
      return this.sanitizeUser(user);
    } catch (error) {
      logger.error('Failed to get user profile', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private static sanitizeUser(user: User): UserResponse {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private static getDefaultPermissions(role: string): string[] {
    switch (role) {
      case 'ADMIN':
        return ['*'];
      case 'MANAGER':
        return ['read', 'write', 'update'];
      case 'USER':
      default:
        return ['read'];
    }
  }
}

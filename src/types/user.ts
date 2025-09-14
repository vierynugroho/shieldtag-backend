import { authSchemas } from '@/common/schemas/auth.schema';
import { RoleName } from '@/generated/prisma';
import { z } from 'zod';

// User interface
export interface User {
  id: string;
  name?: string | null;
  email: string;
  password?: string;
  role: {
    id: string;
    name: string;
  };
  permissions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Type exports
export type LoginInput = z.infer<typeof authSchemas.login>;
export type RegisterInput = z.infer<typeof authSchemas.register>;
export type UpdateUserInput = z.infer<typeof authSchemas.register>;

// User response (without password)
export type UserResponse = Omit<User, 'password'>;

// Auth response
export interface AuthResponse {
  user: UserResponse;
  token: string;
  refreshToken?: string;
}

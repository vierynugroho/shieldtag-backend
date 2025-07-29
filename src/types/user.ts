import { z } from 'zod';

// User role enum
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for responses
  role: UserRole;
  permissions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// Register validation schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.USER),
});

// User update schema
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
  role: z.nativeEnum(UserRole).optional(),
  permissions: z.array(z.string()).optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// User response (without password)
export type UserResponse = Omit<User, 'password'>;

// Auth response
export interface AuthResponse {
  user: UserResponse;
  token: string;
  refreshToken?: string;
}

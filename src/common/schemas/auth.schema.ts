import { z } from 'zod';

export const authSchemas = {
  register: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email address'),
    role_id: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
  login: z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
  update: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      .optional(),
    email: z.email('Please enter a valid email address').optional(),
  }),
};

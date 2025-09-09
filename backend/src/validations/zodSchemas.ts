import { z } from 'zod';

export const nameSchema = z.string().min(20, 'Name must be 20–60 characters').max(60, 'Name must be 20–60 characters');
export const addressSchema = z.string().max(400, 'Address must be ≤ 400 characters');
export const emailSchema = z.string().email('Invalid email');
export const passwordSchema = z.string().min(8).max(16)
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

export const signupSchema = z.object({
  name: nameSchema, email: emailSchema, address: addressSchema, password: passwordSchema
});

export const createUserSchema = z.object({
  name: nameSchema, email: emailSchema, address: addressSchema, password: passwordSchema,
  role: z.enum(['ADMIN','USER','OWNER'])
});

export const createStoreSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  address: z.string().min(1),
  ownerId: z.string().optional().nullable()
});

export const ratingSchema = z.object({ stars: z.number().int().min(1).max(5) });

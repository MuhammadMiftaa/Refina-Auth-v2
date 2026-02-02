import z from 'zod';

export class CompleteProfileRequest {
  name: string;
  password: string;
  confirmPassword: string;
}

export const completeProfileRequestValidation = z
  .object({
    name: z.string().min(2).max(100),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

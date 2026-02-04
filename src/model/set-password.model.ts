import z from 'zod';

export class SetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export const setPasswordRequestValidation = z
  .object({
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

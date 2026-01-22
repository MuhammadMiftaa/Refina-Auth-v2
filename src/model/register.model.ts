import z from 'zod';

export class RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const registerRequestValidation = z.object({
  name: z.string().min(2).max(100),
  email: z.string(),
  password: z.string().min(6).max(100),
});

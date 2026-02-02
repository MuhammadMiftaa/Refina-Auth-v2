import z from 'zod';

export class LoginRequest {
  email: string;
  password: string;
}

export const loginRequestValidation = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

import z from 'zod';

export class RegisterRequest {
  email: string;
}

export const registerRequestValidation = z
  .object({
    email: z.email(),
  })
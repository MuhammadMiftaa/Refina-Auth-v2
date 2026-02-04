import z from 'zod';

export class RequestSetPasswordRequest {
  email: string;
}

export const requestSetPasswordValidation = z
  .object({
    email: z.email(),
  })
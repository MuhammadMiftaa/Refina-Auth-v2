import z from 'zod';

export class VerifyOTPRequest {
  email: string;
  otp: string;
}

export const verifyOTPRequestValidation = z.object({
  email: z.email(),
  otp: z.string().min(6).max(6),
});

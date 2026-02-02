import bcryptjs from 'bcryptjs';
import {
  HASH_PASSWORD_SALT,
  OTP_LENGTH,
  TEMP_TOKEN_LENGTH,
} from './const.utils';

export function generateHashPassword(password: string): string {
  return bcryptjs.hashSync(password, HASH_PASSWORD_SALT);
}

export function generateOTP(): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return otp;
}

export function generateTempToken(): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < TEMP_TOKEN_LENGTH; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

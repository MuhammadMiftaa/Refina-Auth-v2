import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { ValidationService } from 'src/validation/validation/validation.service';
import z from 'zod';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private validationService: ValidationService,
  ) {}

  async register(name: string, email: string, password: string): Promise<User> {
    const result = this.validationService.validate(
      z.object({
        name: z.string().min(2).max(100),
        email: z.string(),
        password: z.string().min(6).max(100),
      }),
      { name, email, password },
    );
    return this.prisma.user.create({
      data: {
        name: result.name,
        email: result.email,
        password: result.password,
      },
    });
  }

  async login() {
    // login logic
    return {
      message: 'User logged in successfully',
    };
  }

  async oauthLogin(provider: string) {
    // OAuth login logic for different providers
    switch (provider) {
      case 'google':
        // Google login logic
        break;
      case 'microsoft':
        // Microsoft login logic
        break;
      case 'github':
        // GitHub login logic
        break;
      default:
        throw new Error('Unsupported provider');
    }
  }

  async googleLoginCallback() {
    // Google login callback logic
    return {
      message: 'Google login callback successful',
    };
  }

  async microsoftLoginCallback() {
    // Microsoft login callback logic
    return {
      message: 'Microsoft login callback successful',
    };
  }

  async githubLoginCallback() {
    // GitHub login callback logic
    return {
      message: 'GitHub login callback successful',
    };
  }

  async logout() {
    // logout logic
    return {
      message: 'User logged out successfully',
    };
  }
}

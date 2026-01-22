import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(name: string, email: string, password: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        name,
        email,
        password,
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

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { CompleteProfileRequest } from 'src/model/complete-profile.model';
import { LoginRequest } from 'src/model/login.model';
import { RegisterRequest } from 'src/model/register.model';
import { VerifyOTPRequest } from 'src/model/verify-otp.model';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { OTP_EXPIRATION, OTP_STATUS } from 'src/utils/const.utils';
import {
  generateHashPassword,
  generateOTP,
  generateTempToken,
} from 'src/utils/generate.utils';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email/email.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(body: RegisterRequest): Promise<{ email: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }

    const OTP = generateOTP();

    const [_, insertOTP] = await this.prisma.$transaction([
      this.prisma.oTP.updateMany({
        where: {
          email: body.email,
        },
        data: {
          status: OTP_STATUS._EXPIRED,
        },
      }),
      this.prisma.oTP.create({
        select: {
          email: true,
          code: true,
          status: true,
          expiresAt: true,
        },
        data: {
          email: body.email,
          code: OTP,
          status: OTP_STATUS._ACTIVE,
          expiresAt: new Date(Date.now() + OTP_EXPIRATION),
        },
      }),
    ]);

    try {
      await this.emailService.sendOTP(body.email, OTP);
    } catch (error) {
      this.logger.error('Error sending OTP email:', error);
    }

    return { email: insertOTP.email };
  }

  async verifyOTP(body: VerifyOTPRequest): Promise<{ tempToken: string }> {
    const OTP = await this.prisma.oTP.findFirst({
      select: {
        id: true,
        email: true,
        code: true,
        status: true,
        expiresAt: true,
      },
      where: {
        email: body.email,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!OTP) {
      throw new HttpException('Invalid OTP', 400);
    }

    if (OTP.code !== body.otp) {
      throw new HttpException('Invalid OTP', 400);
    }

    if (OTP.status !== OTP_STATUS._ACTIVE) {
      throw new HttpException('OTP is not active', 400);
    }

    if (OTP.expiresAt < new Date()) {
      throw new HttpException('OTP has expired', 400);
    }

    const tempToken = generateTempToken();

    await this.prisma.oTP.update({
      where: {
        id: OTP.id,
      },
      data: {
        status: OTP_STATUS._USED,
        tempToken: tempToken,
      },
    });

    return { tempToken };
  }

  async completeProfile(
    body: CompleteProfileRequest,
    tempToken: string,
  ): Promise<User> {
    if (!tempToken) {
      throw new HttpException('Invalid temp token', 400);
    }

    const OTP = await this.prisma.oTP.findFirst({
      select: {
        id: true,
        email: true,
        status: true,
        expiresAt: true,
      },
      where: {
        tempToken: tempToken,
      },
    });

    if (!OTP) {
      throw new HttpException('Invalid token', 400);
    }

    if (OTP.status !== OTP_STATUS._USED) {
      throw new HttpException('Invalid token', 400);
    }

    if (OTP?.expiresAt < new Date()) {
      await this.prisma.oTP.update({
        where: {
          id: OTP.id,
        },
        data: {
          status: OTP_STATUS._EXPIRED,
        },
      });
      throw new HttpException('Expired token', 400);
    }

    const userExists = await this.prisma.user.findUnique({
      where: {
        email: OTP.email,
      },
    });

    if (userExists) {
      throw new HttpException('User already exists', 400);
    }

    const hashedPassword = generateHashPassword(body.password);

    const userCreated = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: body.name,
          email: OTP.email,
          password: hashedPassword,
        },
      });

      await tx.userAuthProvider.create({
        data: {
          provider: 'local',
          providerUserId: user.id,
          userId: user.id,
        },
      });

      await tx.oTP.update({
        where: {
          id: OTP.id,
        },
        data: {
          status: OTP_STATUS._COMPLETED,
        },
      });

      return user;
    });

    return userCreated;
  }

  async login(body: LoginRequest): Promise<{ token: string }> {
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        userAuthProvider: {
          select: {
            provider: true,
            providerUserId: true,
          }
        },
        createdAt: true,
        deletedAt: true,
      },
      where: {
        email: body.email,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isValidPassword = bcrypt.compareSync(body.password, user.password);

    if (!isValidPassword) {
      throw new HttpException('Invalid password', 400);
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      userAuthProvider: user.userAuthProvider,
    });

    return { token };
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

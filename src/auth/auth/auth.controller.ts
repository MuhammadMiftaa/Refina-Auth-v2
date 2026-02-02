import { Body, Controller, HttpException, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterRequest,
  registerRequestValidation,
} from 'src/model/register.model';
import { ValidationPipe } from 'src/validation/validation.pipe';
import {
  VerifyOTPRequest,
  verifyOTPRequestValidation,
} from 'src/model/verify-otp.model';
import {
  CompleteProfileRequest,
  completeProfileRequestValidation,
} from 'src/model/complete-profile.model';
import { LoginRequest, loginRequestValidation } from 'src/model/login.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body(new ValidationPipe(registerRequestValidation)) body: RegisterRequest,
  ) {
    const res = await this.authService.register(body);

    return {
      status: true,
      statusCode: 200,
      message: 'Registration successful, please verify your email',
      data: res,
    };
  }

  @Post('/verify-otp')
  async verifyOTP(
    @Body(new ValidationPipe(verifyOTPRequestValidation))
    body: VerifyOTPRequest,
  ) {
    const res = await this.authService.verifyOTP(body);

    return {
      status: true,
      statusCode: 200,
      message: 'OTP verified successfully',
      data: res,
    };
  }

  @Post('/complete-profile')
  async completeProfile(
    @Body(new ValidationPipe(completeProfileRequestValidation))
    body: CompleteProfileRequest,
    @Query('tempToken') tempToken: string,
  ) {
    const user = await this.authService.completeProfile(body, tempToken);

    return {
      status: true,
      statusCode: 200,
      message: 'Profile completed successfully',
      data: user,
    };
  }

  @Post('/login')
  async login(
    @Body(new ValidationPipe(loginRequestValidation)) user: LoginRequest,
  ) {
    const token = await this.authService.login(user);

    return {
      status: true,
      statusCode: 200,
      message: 'Login successful',
      data: token,
    };
  }

  @Post('/google')
  googleLogin() {
    return this.authService.oauthLogin('google');
  }

  @Post('/google/callback')
  googleLoginCallback() {
    return this.authService.googleLoginCallback();
  }

  @Post('/microsoft')
  microsoftLogin() {
    return this.authService.oauthLogin('microsoft');
  }

  @Post('/microsoft/callback')
  microsoftLoginCallback() {
    return this.authService.microsoftLoginCallback();
  }

  @Post('/github')
  githubLogin() {
    return this.authService.oauthLogin('github');
  }

  @Post('/github/callback')
  githubLoginCallback() {
    return this.authService.githubLoginCallback();
  }

  @Post('/logout')
  logout() {
    return this.authService.logout();
  }
}

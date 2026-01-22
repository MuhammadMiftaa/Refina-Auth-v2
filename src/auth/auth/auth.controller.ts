import {
  Body,
  Controller,
  HttpException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'generated/prisma/client';
import { ValidationFilter } from 'src/validation/validation.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  // @UseFilters(ValidationFilter)
  register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<User> {
    return this.authService.register(name, email, password);
  }

  @Post('/login')
  login(@Body('email') email: string, @Body('password') password: string) {
    if (!email || !password) {
      throw new HttpException(
        {
          status: false,
          statusCode: 400,
          message: 'Email and password are required',
        },
        400,
      );
    }

    return this.authService.login();
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

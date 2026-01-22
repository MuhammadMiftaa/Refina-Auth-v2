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
import {
  RegisterRequest,
  registerRequestValidation,
} from 'src/model/register.model';
import { ValidationPipe } from 'src/validation/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  // @UseFilters(ValidationFilter)
  register(
    @Body(new ValidationPipe(registerRequestValidation)) body: RegisterRequest,
  ): Promise<User> {
    return this.authService.register(body);
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

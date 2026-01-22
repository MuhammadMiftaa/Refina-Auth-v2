import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register() {
    return this.authService.register();
  }

  @Post('/login')
  login() {
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

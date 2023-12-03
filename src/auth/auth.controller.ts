import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, SignInReturnType } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: Record<string, any>): Promise<SignInReturnType> {
    //TODO: Add Validation
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}

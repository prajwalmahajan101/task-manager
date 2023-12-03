import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, SignInReturnType } from './auth.service';
import { SignInDto } from './dto/signInDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: SignInDto): Promise<SignInReturnType> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}

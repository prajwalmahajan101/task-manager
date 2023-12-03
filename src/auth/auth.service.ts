import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

export type SignInReturnType = {
  access_token: string;
};

export type PayloadType = {
  sub: number;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<SignInReturnType> {
    const user: User = await this.usersService.getByName(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload: PayloadType = { sub: user.userID, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}

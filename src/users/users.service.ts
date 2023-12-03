import { Injectable } from '@nestjs/common';

export type User = {
  userID: number;
  username: string;
  password: string;
};
@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userID: 1,
      username: 'prajwal',
      password: 'admin',
    },
    {
      userID: 1,
      username: 'test2',
      password: 'admin2',
    },
  ];

  async getByName(username: string): Promise<User | undefined> {
    return this.users.find((user: User): boolean => user.username === username);
  }
}

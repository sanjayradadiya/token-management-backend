import { Injectable } from '@nestjs/common';
import { hashSync, compareSync } from 'bcrypt';

@Injectable()
export class PasswordManagerHelperClass {
  async encryptPassword(password: string): Promise<string> {
    return hashSync(password, 12);
  }

  async comparePassword({
    password,
    currentPassword,
  }: {
    password: string;
    currentPassword: string;
  }): Promise<boolean> {
    if (!currentPassword) {
      return false;
    }
    return compareSync(password, currentPassword);
  }
}

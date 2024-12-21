import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserLoginDto } from '../lib/src/user/dto/user.dto';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'mobileNumber' });
  }

  async validate(body: UserLoginDto): Promise<any> {
    const user = await this.authService.validateUser(body);
    console.log('User validation', user);
    if (!user?.success) {
      throw new UnauthorizedException(user.reason);
    }
    return user;
  }
}

import { Injectable } from '@nestjs/common';
import { UserSchema } from '../lib/src/types/user/user';
import { UserLoginDto } from '../lib/src/user/dto/user.dto';
import { UserService } from '../lib/src/user/user.service';
import { UserValidatorsHelperClass } from './helpers/user-validator';
import { jwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userValidatorHelper: UserValidatorsHelperClass,
  ) {}

  async validateUser(data: UserLoginDto) {
    const userData = await this.userService.findUserByMobileNumber(
      data.mobileNumber,
      data.otp,
    );
    const userD = await this.userValidatorHelper.validateLoginUser(
      { mobileNumber: data.mobileNumber, otp: data.otp },
      userData as unknown as UserSchema,
    );
    if (userD) {
      return userD;
    }
    return null;
  }

  async validateJwtToken(payload: jwtPayload) {
    const user = await this.userService.findUserById(payload.userId);
    const { otp, ...userData } = user;
    return { success: true, userData };
  }
}

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { UserService } from 'apps/appointment/src/user/user.service';
import { TokenManagerHelperClass } from './tokenManager.helper';
import { CreateUserInput } from 'apps/appointment/src/user/dto/create-user.input';
import {
  UserSchema,
  UserStatusEnum,
} from 'apps/appointment/src/types/users/user';
import { UserDto } from 'apps/appointment/src/user/dto/user.dto';
import { UserContext } from 'apps/appointment/src/types/users/utilities';
import { LoginUserInput } from 'apps/appointment/src/types/auth/input';

@Injectable()
export class UserValidatorsHelperClass {
  private userService: UserService;
  private configService: ConfigService;
  constructor(private tokenManagerHelperClass: TokenManagerHelperClass) {}

  async validateCreateUserInput(
    input: CreateUserInput,
    existingUser?: UserSchema,
  ): Promise<void> {
    if (!existingUser) {
      return;
    }

    const { status } = existingUser;

    if (status === UserStatusEnum.ACTIVE) {
      throw new Error(
        'A user with this mobileNumber address is already registered.',
      );
    }
  }

  async validateUpdateUserInput(
    input: Partial<UserDto>,
    userContext: UserContext,
    existingUser?: UserSchema,
  ): Promise<void> {
    const { id, mobileNumber, otp } = input;

    if (!existingUser) {
      throw new Error(
        `User not found: ${id} ${__filename} - ${this.validateUpdateUserInput.name}`,
      );
    }

    if (mobileNumber && mobileNumber !== existingUser.mobileNumber) {
      const user = await this.userService.findUserByMobileNumber(
        mobileNumber,
        otp,
      );
      if (user) {
        throw new Error(
          `User with new mobileNumber already exists ${__filename} - ${this.validateUpdateUserInput.name}`,
        );
      }
    }
  }

  async validateLoginUser(
    input: LoginUserInput,
    existingUser?: UserSchema,
  ): Promise<Partial<UserSchema>> {
    try {
      const { otp } = input;
      if (!existingUser) {
        return {
          success: false,
          reason: `We can't find Mobile Number and OTP.`,
        };
      }

      if (existingUser) {
        const isOTPCorrect = await this.tokenManagerHelperClass.compareOTP({
          otp,
          user: existingUser,
        });
        if (!isOTPCorrect) {
          if (
            typeof existingUser.isOtpReSend === 'boolean' &&
            !existingUser.isOtpReSend
          ) {
            const temporaryUserContext: Partial<UserContext> = {
              currentUserInfo: {
                ...(existingUser as UserSchema),
                mobileNumber: existingUser.mobileNumber,
              },
              requestTimestamp: new Date().toISOString(),
            };
            return {
              success: false,
              reason: `Token_System has been updated and upgraded to give you a much better experience and to improve security. Part of the security upgrade requires you to Re-login. Please check OTP is sended from Token_System for Re-Login. Thank you for using Token_System.`,
            };
          }
          return {
            success: false,
            reason: "We can't find that OTP. You can resend OTP or try again.",
          };
        }
      }
      return { ...existingUser, success: true, reason: 'successfully login!' };
    } catch (error) {
      throw error;
    }
  }
}

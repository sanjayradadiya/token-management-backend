import { BusinessService, UserService } from 'libs/lib/src';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { CreateOTPDto, LoginDto, UserLoginDto } from './dto/login.dto';
import { BusinessSignupInput } from './dto/signup.dto';
import { Business } from 'libs/lib/src/business/entities/business.entities';
import { TokenManagerHelperClass } from 'libs/auth/helpers/tokenManager.helper';
import { PasswordManagerHelperClass } from 'libs/auth/helpers/password.manager.helper';
import { jwtPayload, UserValidatorsHelperClass } from 'libs/auth';
import { User } from 'libs/lib/src/user/entities/user.entities';
import { UserSchema } from 'libs/lib/src/types/user/user';

@Injectable()
export class LoginService {
  constructor(
    private businessService: BusinessService,
    private userService: UserService,
    private TokenManagerHelper: TokenManagerHelperClass,
    private userValidatorHelper: UserValidatorsHelperClass,
    private passwordManagerHelper: PasswordManagerHelperClass,
    private service: ConfigService,
  ) {
    this.initializeBaseUrl();
  }

  base_url: string;
  async initializeBaseUrl() {
    this.base_url = await this.service.get('FRONT_END_BASE_URL');
  }

  async signup(data: BusinessSignupInput) {
    const business: Business = new Business();

    const encryptedPassword = await this.passwordManagerHelper.encryptPassword(
      data.password,
    );

    business.name = data.name;
    business.mobileNumber = data.mobileNumber;
    business.ownerName = data.ownerName;
    business.userName = data.userName;
    business.password = encryptedPassword;
    business.businessType = data.businessType;
    business.address = data.address;
    business.workingTime = data.workingTime;

    return this.businessService
      .save(business)
      .then(async (data) => {
        const token = this.TokenManagerHelper.createLoginToken({
          userName: data.username,
          userId: data.id.toString(),
        });

        await this.businessService.updateBusiness(data.id, { ...token });
        return {
          success: true,
          token,
        };
      })
      .catch((error) => {
        return {
          success: false,
          reason:
            error.code === '23505'
              ? 'The same business is already registered.'
              : 'Something went to wrong.',
        };
      });
  }

  async login(body: LoginDto) {
    const businessData = await this.businessService.findBusinessByUsername(
      body.userName,
      body.password,
    );

    if (!businessData) {
      return {
        success: false,
        reason: `We can't find that email and password.`,
      };
    }

    const isPasswordCorrect = await this.passwordManagerHelper.comparePassword({
      password: body.password,
      currentPassword: businessData.password,
    });

    if (!isPasswordCorrect) {
      return {
        success: false,
        reason:
          "We can't find that email and password. You can reset your password or try again.",
      };
    }

    const loginToken = this.TokenManagerHelper.createLoginToken({
      userName: businessData.userName,
      userId: businessData.id.toString(),
    });

    await this.businessService.updateBusiness(businessData.id, {
      ...loginToken,
    });

    return { success: true, token: loginToken };
  }

  async createOTP(data: CreateOTPDto) {
    const CreateData = await this.userService.findOne(data.mobileNumber);

    const otp = '123456';
    const otpGenerationTime = new Date();
    const otpExpiresAt = new Date(
      otpGenerationTime.getTime() + 15 * 60 * 60 * 1000,
    );
    console.log(`User Mobile Number: ${data.mobileNumber} and otp is ${otp}`);
    try {
      if (CreateData) {
        CreateData.otp = otp;
        CreateData.expiredOtp = otpExpiresAt;
        await this.userService.save(CreateData);

        return {
          success: true,
          otp: otp,
          reason: 'Create OTP Successfully',
        };
      } else {
        const userData: User = new User();
        userData.mobileNumber = data.mobileNumber;
        userData.otp = otp;
        userData.expiredOtp = otpExpiresAt;
        await this.userService.save(userData);
        return {
          success: true,
          otp: otp,
          reason: 'New User is Created OTP Successfully',
        };
      }
    } catch (error) {
      return {
        success: false,
        reason: `User Can't Create a OTP`,
      };
    }
  }

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
    return { success: true, userData, otp };
  }

  async userLogin(data: UserLoginDto) {
    const userData = await this.userService.findUserByMobileNumber(
      data.mobileNumber,
      data.otp,
    );

    if (userData) {
      const loginToken = this.TokenManagerHelper.createLoginToken({
        userName: userData.mobileNumber,
        userId: userData.id.toString(),
      });
      // const otp = userData.otp;
      userData.expiredOtp = null;
      await this.userService.save(userData);
      await this.userService.updateUser(userData.id, { ...loginToken });

      return {
        success: true,
        reason: 'User Login Successfully.',
        token: loginToken,
      };
    } else {
      return {
        success: false,
        reason: 'User Login Failed',
      };
    }
  }
}

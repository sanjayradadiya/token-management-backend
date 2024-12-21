import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { AppConfigs } from '../appConfig';
import {
  AccessTokenPayload,
  CreateLoginTokenInput,
  GenerateTokenInput,
  RefreshTokenPayload,
  TokenUsageEnum,
} from '../types/token.interface';
import { LoginTokenPayload } from '../payload/login';
import { JWTConstants } from '../constants';

@Injectable()
export class TokenManagerHelperClass {
  private jwtSecret!: string;
  constructor(
    private appConfig: AppConfigs,
    private jwtService: JwtService,
  ) {
    this.setJwtSecret();
  }

  private setJwtSecret(): void {
    this.jwtSecret = this.appConfig.jwtAuthSecret();
  }

  private generateToken({
    payload,
    expiresInHours,
  }: GenerateTokenInput): string {
    return this.jwtService.sign(payload, {
      secret: JWTConstants.secret,
      expiresIn: `${expiresInHours}h`,
    });
  }

  private createRefreshToken(input: RefreshTokenPayload): string {
    return this.generateToken({ payload: input, expiresInHours: 24 * 30 });
  }

  private createAccessToken(input: AccessTokenPayload): string {
    return this.generateToken({ payload: input, expiresInHours: 24 });
  }

  createLoginToken(input: CreateLoginTokenInput): LoginTokenPayload {
    const { userName, userId } = input;

    const accessToken = this.createAccessToken({
      userName,
      tokenUse: TokenUsageEnum.ACCESS,
      userId,
    });
    const refreshToken = this.createRefreshToken({
      tokenUse: TokenUsageEnum.REFRESH,
      userId,
    });

    return { accessToken, refreshToken };
  }

  async compareOTP({ otp, user }: { otp: any; user: any }): Promise<boolean> {
    const { otp: currentOtp } = user;
    if (!currentOtp) {
      return false;
    }
    const result = otp === currentOtp;
    if (result) {
      console.log('OTP correct');
    } else {
      console.log('OTP wrong');
    }
    return result;
  }
}

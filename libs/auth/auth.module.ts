import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenManagerHelperClass } from './helpers/tokenManager.helper';
import { UserModule } from '../lib/src';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWTConstants } from './constants';
import { LocalStrategy } from './local.stretagy';
import { JwtStrategy } from './jwt.strategy';
import { GqlJwtAuthGuard } from './gql-jwt-auth.guard';
import { UserValidatorsHelperClass } from './helpers/user-validator';
import { PasswordManagerHelperClass } from './helpers/password.manager.helper';
import { AppConfigs } from './appConfig';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWTConstants.secret,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  providers: [
    AuthService,
    TokenManagerHelperClass,
    LocalStrategy,
    JwtStrategy,
    GqlJwtAuthGuard,
    PasswordManagerHelperClass,
    UserValidatorsHelperClass,
    AppConfigs,
  ],
  exports: [AuthService],
})
export class AuthModule {}

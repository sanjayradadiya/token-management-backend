import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MemberModule } from '../member/member.module';
import { AuthModule } from 'libs/auth';
import { JwtStrategy } from 'libs/auth/jwt.strategy';
import { GqlJwtAuthGuard } from 'libs/auth/gql-jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => MemberModule),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, UserResolver, JwtStrategy, GqlJwtAuthGuard],
  exports: [UserService],
})
export class UserModule {}

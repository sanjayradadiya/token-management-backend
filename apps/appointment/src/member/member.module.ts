import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entities';
import { MemberService } from './member.service';
import { MemberResolver } from './member.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), forwardRef(() => UserModule)],
  providers: [MemberService, MemberResolver],
  exports: [MemberService],
})
export class MemberModule {}

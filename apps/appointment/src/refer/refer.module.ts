import { forwardRef, Module } from '@nestjs/common';
import { ReferService } from './refer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refer } from './entities/refer.entities';
import { ReferResolver } from './refer.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Refer]), forwardRef(() => UserModule)],
  providers: [ReferService, ReferResolver],
  exports: [ReferService],
})
export class ReferModule {}

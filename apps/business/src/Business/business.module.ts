import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entities';
import { BusinessService } from './business.service';
import { BusinessResolver } from './business.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  providers: [BusinessService, BusinessResolver],
  exports: [BusinessService],
})
export class BusinessModule {}

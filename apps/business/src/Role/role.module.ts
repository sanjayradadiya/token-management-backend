import { Module, forwardRef } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './entities/role.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleResolver } from './role.resolver';
import { BusinessModule } from '../Business/business.module';
// import { Permission } from '../permission/entities/permission.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => BusinessModule)],
  providers: [RoleService, RoleResolver],
  exports: [RoleService],
})
export class RoleModule {}

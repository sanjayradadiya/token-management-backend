import { forwardRef, Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entities';
import { AppointmentResolver } from './appointment.resolver';
import { UserModule } from '../user/user.module';
import { BusinessModule } from 'libs/lib/src';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    forwardRef(() => BusinessModule),
    forwardRef(() => UserModule),
    forwardRef(() => MemberModule),
  ],
  providers: [AppointmentService, AppointmentResolver],
  exports: [AppointmentService],
})
export class AppointmentModule {}

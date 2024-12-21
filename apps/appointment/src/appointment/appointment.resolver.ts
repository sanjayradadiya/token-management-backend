import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateAppointmentInput } from './dto/create-appoinment.input';
import { UpdateAppointmentInput } from './dto/update-appoinment.input';
import { Appointment } from './entities/appointment.entities';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentPayload } from './payload/createAppointment.payload';
import { UpdateAppointmentPayload } from './payload/updateAppointment.payload';
import { Appointments } from './types/appointmentList';
import { AppointmentFilter } from './dto/filter-appoinment';
import { User } from '../user/entities/user.entities';
import { RemoveAppointmentPayload } from './payload/removeAppointment.payload';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';

@Resolver(() => Appointment)
export class AppointmentResolver {
  constructor(private appointmentService: AppointmentService) {}

  @Mutation(() => CreateAppointmentPayload, { name: 'createAppointment' })
  createAppointment(
    @Args('input') createAppointmentInput: CreateAppointmentInput,
  ) {
    return this.appointmentService.create(createAppointmentInput);
  }

  @Mutation(() => UpdateAppointmentPayload, { name: 'updateAppointment' })
  updateAppointment(
    @Args('input') updateAppointmentInput: UpdateAppointmentInput,
  ) {
    return this.appointmentService.update(updateAppointmentInput);
  }

  @Query(() => Appointments, { name: 'appointments' })
  async appointments(
    @Args('filters', { nullable: true, defaultValue: {} })
    filters: AppointmentFilter,
    @Args('sorts', { type: () => [SortProps], nullable: true })
    sorts: SortProps[],
    @Args('pageInfo', {
      type: () => PageInfoProps,
      nullable: true,
      defaultValue: { pageNumber: 1, pageSize: 50 },
    })
    pageInfo: PageInfoProps,

    user: User,
  ): Promise<Appointments> {
    return this.appointmentService.findAll(user, filters, sorts, pageInfo);
  }

  @Query(() => Appointment, { name: 'appointment' })
  async findOneById(@Args('id') id: string): Promise<Appointment> {
    return this.appointmentService.findOneById(id);
  }

  @Query(() => Appointment, { name: 'LastAppointment' })
  async findLastAppointment(@Args('userId') userId: string) {
    return this.appointmentService.lastAppointment(userId);
  }

  @Query(() => Appointment, { name: 'CurrentAppointment' })
  async findOneAppointmentById(
    @Args('id') id: string,
    @Args('userId') userId: string,
  ): Promise<Appointment> {
    return this.appointmentService.findOneAppointmentById(id, userId);
  }

  @Query(() => [Appointment], { name: 'findAppointmentByUserId' })
  async findAppointmentByUserId(
    @Args('userId') userId: string,
  ): Promise<Appointment[]> {
    return this.appointmentService.findAppointmentByUserId(userId);
  }

  @Mutation(() => RemoveAppointmentPayload)
  async removeAppointment(@Args('id') id: string): Promise<any> {
    return await this.appointmentService.removeAppointment(id);
  }
}

import { Field, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from 'libs/lib/src/payloads/mutationResponse';
import { Appointment } from '../entities/appointment.entities';

@ObjectType()
export class UpdateAppointmentPayload extends MutationResponse {
  @Field(() => Appointment, { nullable: true })
  appointment?: Appointment;
}

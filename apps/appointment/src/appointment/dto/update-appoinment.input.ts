import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateAppointmentInput } from './create-appoinment.input';

@InputType()
export class UpdateAppointmentInput extends PartialType(
  CreateAppointmentInput,
) {
  @Field({ nullable: true })
  id: string;
}

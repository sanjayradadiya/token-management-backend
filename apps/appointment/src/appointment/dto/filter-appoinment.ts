import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AppointmentFilter {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  tokenNumber: number;

  @Field({ nullable: true })
  businessId: string;

  @Field({ nullable: true })
  userId: string;

  @Field({ nullable: true })
  isReferral: boolean;
}

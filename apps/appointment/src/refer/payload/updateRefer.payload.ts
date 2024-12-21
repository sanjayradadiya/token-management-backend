import { Field, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from 'libs/lib/src/payloads/mutationResponse';
import { Refer } from '../entities/refer.entities';

@ObjectType()
export class UpdateReferPayload extends MutationResponse {
  @Field(() => Refer, { nullable: true })
  refer?: Refer;
}

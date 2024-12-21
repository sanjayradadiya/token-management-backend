import { Field, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from 'libs/lib/src/payloads/mutationResponse';
import { Business } from '../entities/business.entities';

@ObjectType()
export class UpdateBusinessPayload extends MutationResponse {
  @Field(() => Business, { nullable: true })
  business?: Business;
}

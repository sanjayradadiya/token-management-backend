import { Field, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from 'libs/lib/src/payloads/mutationResponse';
import { User } from '../entities/user.entities';

@ObjectType()
export class CreateUserPayload extends MutationResponse {
  @Field(() => User, { nullable: true })
  user?: User;
}

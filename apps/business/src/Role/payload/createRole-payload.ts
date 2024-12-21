import { Field, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from 'libs/lib/src/payloads/mutationResponse';
import { Role } from '../entities/role.entities';

@ObjectType()
export class CreateRolePayload extends MutationResponse {
  @Field(() => Role, { nullable: true })
  role?: Role;
}

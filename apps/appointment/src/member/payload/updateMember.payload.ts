import { Field, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from 'libs/lib/src/payloads/mutationResponse';
import { Member } from '../entities/member.entities';

@ObjectType()
export class UpdateMemberPayload extends MutationResponse {
  @Field(() => Member, { nullable: true })
  member?: Member;
}

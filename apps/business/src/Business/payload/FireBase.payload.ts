import { Field, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from 'libs/lib/src/payloads/mutationResponse';

@ObjectType()
export class FirebasePayload extends MutationResponse {
  @Field({ nullable: false })
  token: string;
}

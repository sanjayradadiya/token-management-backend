import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateBusinessInput } from './create-business.input';

@InputType()
export class UpdateBusinessInput extends PartialType(CreateBusinessInput) {
  @Field({ nullable: true })
  id: string;
}

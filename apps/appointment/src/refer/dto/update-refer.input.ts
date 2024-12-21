import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateReferInput } from './create-refer.input';

@InputType()
export class UpdateReferInput extends PartialType(CreateReferInput) {
  @Field()
  id: string;
}

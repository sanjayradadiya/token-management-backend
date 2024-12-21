import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PageInfoProps {
  @Field(() => Number, { defaultValue: 1 })
  pageNumber: number;
  
  @Field(() => Number, { defaultValue: 50 })
  pageSize: number;
}

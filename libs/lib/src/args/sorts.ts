import { Field, InputType } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';

export enum SortOrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SortOrderEnum, { name: 'SortOrderEnum' });

@InputType()
export class SortProps {
  @Field(() => String, { nullable: true })
  sortField: string;
  @Field(() => SortOrderEnum, {
    nullable: true,
  })
  sortOrder: SortOrderEnum;
  /** Custom field path to get last value */
  @Field(() => String, { nullable: true })
  fieldPath?: string;
}

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RoleFilters {
  @Field(() => String, { nullable: true })
  id?: string;
  
  @Field(() => String, { nullable: true })
  role_type?: string;

}

import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @ApiProperty({
    description: `role type`,
    required: true,
  })
  @IsNotEmpty()
  @Field()
  role_type: string;
}

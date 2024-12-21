import { Field, InputType, PartialType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateRoleInput } from './create-role';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
  @ApiProperty({
    description: `role type id`,
    required: true,
  })
  @IsNotEmpty()
  @Field()
  id: string;

  @Field(() => [String], { nullable: true })
  permissionIds: string[];
}

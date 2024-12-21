import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from '../../Business/entities/business.entities';
import { RoleStatusEnum } from '../enum/roleStatus.enum';

@ObjectType('role')
@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  @IsNotEmpty({
    message: 'Role type is required',
  })
  @Field()
  role_type: string;

  @Column({
    type: 'enum',
    enum: RoleStatusEnum,
    default: RoleStatusEnum.ACTIVE,
  })
  @Field()
  status: string;

  @ManyToMany(() => Business, (business) => business.id)
  @Field(() => [Business], { nullable: true })
  businesses: Business[];
}

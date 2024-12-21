import { ObjectType, Field } from '@nestjs/graphql';
import { validateOrReject } from 'class-validator';
import { User } from '../../user/entities/user.entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberStatusEnum } from '../types/member';

@ObjectType('member')
@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @Field(() => User, { nullable: true })
  user: User;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  dob: string;

  @Column({
    type: 'enum',
    enum: MemberStatusEnum,
    default: MemberStatusEnum.ACTIVE,
  })
  @Field()
  status: string;
  
  @Column({ nullable: true })
  @Field({ nullable: true })
  address: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  is_default: boolean;

  @CreateDateColumn()
  @Field({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt: Date;

  @BeforeUpdate()
  @BeforeInsert()
  async validate(): Promise<void> {
    return validateOrReject(this);
  }
}

import { ObjectType, Field } from '@nestjs/graphql';
import { validateOrReject } from 'class-validator';
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
import { ReferStatusEnum } from '../../types/refer/refer';
import { User } from '../../user/entities/user.entities';

@ObjectType('refer')
@Entity()
export class Refer {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @Field(() => User, { nullable: true })
  user: User;

  @Column({ nullable: true })
  @Field({ nullable: true })
  businessId: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  refer_by_id: string;

  @Column({
    type: 'enum',
    enum: ReferStatusEnum,
    default: ReferStatusEnum.ACTIVE,
  })
  @Field()
  status: string;

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

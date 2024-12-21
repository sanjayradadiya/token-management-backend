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
import { AppointmentStatusEnum } from '../../types/appointment/appointment';
import { Refer } from '../../refer/entities/refer.entities';
import { Member } from '../../member/entities/member.entities';
import { User } from '../../user/entities/user.entities';
import { Business } from 'libs/lib/src/business/entities/business.entities';

@ObjectType('appointment')
@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @ManyToOne(() => Business, (business) => business.id)
  @Field(() => Business, { nullable: true })
  business: Business;

  @ManyToOne(() => Refer, (refer) => refer.id)
  @Field(() => Refer, { nullable: true })
  refer: Refer;

  @ManyToOne(() => User, (user) => user.id)
  @Field(() => User, { nullable: true })
  user: User;

  @ManyToOne(() => Member, (member) => member.id)
  @Field(() => Member, { nullable: true })
  member: Member;

  @Column({ nullable: true })
  @Field({ nullable: true })
  date_and_time: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  tokenNumber: number;

  @Field(() => AppointmentStatusEnum, { nullable: true })
  @Column({
    type: 'enum',
    enum: AppointmentStatusEnum,
    default: AppointmentStatusEnum.PENDING,
  })
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

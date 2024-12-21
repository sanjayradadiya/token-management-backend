import { Exclude } from 'class-transformer';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserStatusEnum } from '../../types/user/user';

@Entity('user')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
  @IsNotEmpty({
    message: 'Mobile Number is required',
  })
  @IsNotEmpty({
    message: 'Not a valid Mobile Number',
  })
  @Field({ nullable: false })
  mobileNumber: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude({ toPlainOnly: true })
  otp: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  dob: String;

  @Column({ type: 'boolean', nullable: true, default: false })
  @Field({ nullable: true })
  isReferral: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  accessToken: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  refreshToken: string;
  
  @Column({ nullable: true })
  @Field({ nullable: true })
  expiredOtp: Date;

  @CreateDateColumn({ nullable: true })
  @Field({ nullable: true })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  @Field()
  status: string;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt: Date;

  @Column({ type: 'boolean', nullable: true })
  @Field({ nullable: true })
  isLogin: boolean;

  @Field(() => [String], { nullable: true })
  modules: string[];

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  firebaseToken: string;

  @BeforeUpdate()
  @BeforeInsert()
  async validate(): Promise<void> {
    return validateOrReject(this);
  }
}

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
import { BusinessTypeEnum } from '../types/enum';
import { BusinessStatusEnum } from '../../types/business/business';

@Entity('business')
@ObjectType()
export class Business {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
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

  @Column({ type: 'varchar', length: 150, nullable: true })
  @IsNotEmpty({
    message: 'Owner Name is required',
  })
  @Field({ nullable: false })
  ownerName: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
  @IsNotEmpty({
    message: 'UserName is required',
  })
  @Field({ nullable: false })
  userName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  @IsNotEmpty({
    message: 'Password is required',
  })
  @Field({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: BusinessTypeEnum,
    default: BusinessTypeEnum.HOSPITAL,
  })
  @Field()
  businessType: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  @IsNotEmpty({
    message: 'Business Address is required',
  })
  @Field({ nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  @IsNotEmpty({
    message: 'Business Working Time is required',
  })
  @Field({ nullable: false })
  workingTime: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  @IsNotEmpty({
    message: 'Token limit is required',
  })
  @Field({ nullable: false })
  tokenLimit: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude({ toPlainOnly: true })
  @Field({ nullable: true })
  accessToken: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude({ toPlainOnly: true })
  @Field({ nullable: true })
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: BusinessStatusEnum,
    default: BusinessStatusEnum.ACTIVE,
  })
  @Field()
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude({ toPlainOnly: true })
  otp: string;

  @CreateDateColumn()
  @Field({ nullable: true })
  expiredOtp: Date;

  @CreateDateColumn()
  @Field({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  isLogin: boolean;

  @Field(() => [String], { nullable: true })
  modules: string[];

  @Field(() => Boolean, { defaultValue: false })
  isSuperAdmin: boolean;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  firebaseToken: string;

  @BeforeUpdate()
  @BeforeInsert()
  async validate(): Promise<void> {
    return validateOrReject(this);
  }
}

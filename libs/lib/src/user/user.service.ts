import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async save(createData: any): Promise<User[]> {
    const user = this.userRepository.create(createData);
    return await this.userRepository.save(user);
  }

  async findOne(mobileNumber: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { mobileNumber } });
  }

  async updateUser(id: string, updateData: any): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  findUserByMobileNumber(mobileNumber: string, otp: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        mobileNumber: mobileNumber,
        otp: otp,
      },
    });
  }

  findUserById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }
}

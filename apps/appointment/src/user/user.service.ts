import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entities';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { MemberService } from '../member/member.service';
import { Users } from './types/userList';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => MemberService))
    private memberService: MemberService,
    private service: ConfigService,
  ) {
    this.initializeBaseUrl();
  }

  base_url: string;
  async initializeBaseUrl() {
    this.base_url = await this.service.get('FRONT_END_BASE_URL');
  }

  async createOtp(mobileNumber: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { mobileNumber } });

    if (!user) {
      user = this.userRepository.create({
        mobileNumber: mobileNumber,
      });
      user = await this.userRepository.save(user);
    }

    const userData = await this.userRepository.findOne({
      where: { mobileNumber },
    });

    if (!userData) {
      throw new Error('User could not be found or created.');
    }

    const otp = '123456';
    const otpGeneratedAt = new Date();
    const otpExpiresAt = new Date(
      otpGeneratedAt.getTime() + 15 * 60 * 60 * 1000,
    );

    userData.otp = otp;
    userData.expiredOtp = otpExpiresAt;
    await this.userRepository.save(userData);

    return userData;
  }

  async create(createUserInput: CreateUserInput) {
    const user: User = new User();

    user.name = createUserInput.name;
    user.mobileNumber = createUserInput.mobileNumber;
    user.expiredOtp = createUserInput.expiredOtp;
    user.dob = createUserInput.dob;
    user.address = createUserInput.address;

    try {
      await this.userRepository.save(user);
      return {
        success: true,
        reason: 'The new User has been successfully added.',
        user,
      };
    } catch (error) {
      return {
        success: false,
        reason:
          error.code === 'ER_DUP_ENTRY'
            ? 'The user is already a member of the Token_System.'
            : 'Something went to wrong.',
      };
    }
  }

  async verifyOtp(mobileNumber: string, otp: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { mobileNumber, otp },
    });

    if (!user || user.expiredOtp < new Date()) {
      return false;
    }

    user.expiredOtp = null;
    await this.userRepository.save(user);

    return true;
  }

  async findAll(
    filters?: any,
    sorts?: SortProps[],
    pageInfo?: PageInfoProps,
  ): Promise<Users> {
    const where: FindManyOptions<User>['where'] = {};
    const order: FindManyOptions<User>['order'] = {};

    if (filters?.id) {
      where['id'] = filters.id;
    }

    if (filters?.status?.length > 0) {
      where['status'] = In(filters.status);
    }

    if (filters?.name?.length > 0) {
      where['name'] = In(filters.name);
    }

    if (sorts && sorts.length > 0) {
      sorts.forEach((s) => {
        order[s.sortField] = s.sortOrder;
      });
    }

    const { pageNumber, pageSize } = pageInfo;

    const userData = await this.userRepository.find({
      where: { ...where },
      order: { name: 'ASC', ...order },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await this.userRepository.count({
      where: {
        ...where,
      },
    });

    return {
      data: userData,
      pageInfo: {
        pageNumber: pageNumber,
        totalCount: totalCount,
      },
    };
  }

  findUserById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async loginStatus(userId: string, isLogin: boolean) {
    try {
      await this.userRepository.update(userId, { isLogin });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  findUserByMobileNumber(mobileNumber: string, otp: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        mobileNumber: mobileNumber,
        otp: otp,
      },
    });
  }

  async update(updateUserInput: UpdateUserInput) {
    try {
      const userUpdate = new User();
      userUpdate.id = updateUserInput.id;
      userUpdate.name = updateUserInput.name;
      userUpdate.mobileNumber = updateUserInput.mobileNumber;
      userUpdate.address = updateUserInput.address;
      userUpdate.dob = updateUserInput.dob;

      const update = await this.userRepository.save(userUpdate);
      if (userUpdate) {
        return {
          success: true,
          reason: 'The new User has been successfully added.',
          update,
        };
      }
    } catch (error) {
      return { success: false, reason: 'Error Something.' };
    }
  }
}

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  And,
  FindManyOptions,
  FindOptionsWhere,
  In,
  Not,
  Repository,
} from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UpdateMemberInput } from './dto/update-member.input';
import { CreateMemberInput } from './dto/create-member.input';
import { Member } from './entities/member.entities';
import { UserService } from '../user/user.service';
import { Members } from './types/memberList';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';
import { User } from '../user/entities/user.entities';
import { MemberStatusEnum } from './types/member';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private service: ConfigService,
  ) {
    this.initializeBaseUrl();
  }

  base_url: string;
  async initializeBaseUrl() {
    this.base_url = await this.service.get('FRONT_END_BASE_URL');
  }

  async create(creatememberInput: CreateMemberInput, userId: string) {
    const userData = await this.userService.findUserById(userId);

    const member: Member = new Member();

    member.name = creatememberInput.name;
    member.address = creatememberInput.address;
    member.dob = creatememberInput.dob;
    member.user = userData;
    member.status = MemberStatusEnum.ACTIVE;

    try {
      await this.memberRepository.save(member);
      return {
        success: true,
        reason: 'The new Member has been successfully added.',
        member: member,
      };
    } catch (error) {
      return {
        success: false,
        reason:
          error.code === 'ER_DUP_ENTRY'
            ? 'The Member is already a member of the Token_System.'
            : 'Something went to wrong.',
      };
    }
  }

  async findAll(
    user: User,
    filters?: any,
    sorts?: SortProps[],
    pageInfo?: PageInfoProps,
  ): Promise<Members> {
    const where: FindManyOptions<Member>['where'] = {};
    const order: FindManyOptions<Member>['order'] = {};

    if (filters?.id) {
      where['id'] = filters.id;
    }
    if (filters?.status?.length) {
      where['status'] = In(filters.status);
    }

    if (sorts?.length) {
      sorts.forEach((s) => {
        if (['ASC', 'DESC'].includes(s.sortOrder.toUpperCase())) {
          order[s.sortField] = s.sortOrder.toUpperCase();
        } else {
          console.warn(
            `Invalid sortOrder "${s.sortOrder}" for field "${s.sortField}".`,
          );
        }
      });
    }

    const { pageNumber = 1, pageSize = 50 } = pageInfo || {};

    const userFilter: FindOptionsWhere<User> = {};

    if (filters?.usersId?.length) {
      if (!filters.usersId.includes(user.id)) {
        userFilter.id = And(In(filters.usersId), Not(user.id));
      } else {
        userFilter.id = In(filters.usersId);
      }
    }

    const memberData = await this.memberRepository.find({
      where: {
        ...where,
        user: userFilter,
      },
      relations: ['user'],
      order: { name: 'ASC', ...order },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await this.memberRepository.count({
      where: {
        ...where,
        user: userFilter,
      },
      relations: ['user'],
    });

    return {
      data: memberData,
      pageInfo: {
        pageNumber,
        totalCount,
      },
    };
  }

  async findOneById(id: string) {
    return await this.memberRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(updateMemberInput: UpdateMemberInput) {
    try {
      const member = new Member();
      member.id = updateMemberInput.id;
      member.name = updateMemberInput.name;
      member.dob = updateMemberInput.dob;
      member.address = updateMemberInput.address;

      const update = await this.memberRepository.save(member);
      if (member) {
        return {
          success: true,
          reason: 'Member Updated Successfully.',
          update,
        };
      }
    } catch (error) {
      return { success: false, reason: 'Error Something.' };
    }
  }

  async findMatchingUserAndMemberNames(): Promise<Member[]> {
    try {
      const members = await this.memberRepository
        .createQueryBuilder('member')
        .innerJoinAndSelect('member.user', 'user')
        .where('LOWER(member.name) = LOWER(user.name)')
        .getMany();

      return members;
    } catch (error) {
      console.error('Error fetching matching members:', error);
      throw new Error('Could not fetch matching members');
    }
  }

  async getAllByUserId(userId: string): Promise<Member[]> {
    try {
      return await this.memberRepository.find({
        where: { user: { id: userId }, status: MemberStatusEnum.ACTIVE },
        relations: ['user'],
      });
    } catch (error) {
      console.log('Error fetching members:', error);
    }
  }

  async removeMember(id: string) {
    try {
      const data = await this.findOneById(id);
      await this.memberRepository.update(id, {
        status: MemberStatusEnum.DELETED,
      });
      return {
        success: true,
        message: 'The member was deleted successfully.',
      };
    } catch (error) {
      console.log('Error', error);
      return {
        success: false,
        message: "The member can't be deleted. Please try again later.",
      };
    }
  }
}

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  Repository,
  In,
  FindOptionsWhere,
  Not,
  And,
} from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UpdateReferInput } from './dto/update-refer.input';
import { CreateReferInput } from './dto/create-refer.input';
import { Refer } from './entities/refer.entities';
import { Refers } from './types/referList';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entities';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';
import { ReferStatusEnum } from '../types/refer/refer';

@Injectable()
export class ReferService {
  constructor(
    @InjectRepository(Refer)
    private readonly referRepository: Repository<Refer>,
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

  async create(createreferInput: CreateReferInput, userId: string) {
    const userData = await this.userService.findUserById(userId);

    const refer: Refer = new Refer();

    refer.user = userData;
    refer.refer_by_id = createreferInput.refer_by_id;
    refer.businessId = createreferInput.businessId;
    refer.status = createreferInput.status;

    try {
      await this.referRepository.save(refer);
      return {
        success: true,
        reason: 'The new Refer has been successfully added.',
      };
    } catch (error) {
      return {
        success: false,
        reason:
          error.code === 'ER_DUP_ENTRY'
            ? 'The Refer is already a member of the Token_System.'
            : 'Something went to wrong.',
      };
    }
  }

  findOneById(id: string): Promise<Refer> {
    return this.referRepository.findOne({
      where: { id },
    });
  }

  async findAll(
    user: User,
    filters?: any,
    sorts?: SortProps[],
    pageInfo?: PageInfoProps,
  ): Promise<Refers> {
    const where: FindManyOptions<Refer>['where'] = {};
    const order: FindManyOptions<Refer>['order'] = {};

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

    const memberData = await this.referRepository.find({
      where: {
        ...where,
        user: userFilter,
      },
      relations: ['user'],
      order: { user: 'ASC', ...order },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await this.referRepository.count({
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

  async update(updateReferInput: UpdateReferInput) {
    try {
      const refer: Refer = new Refer();
      refer.id = updateReferInput.id;
      refer.businessId = updateReferInput.businessId;
      refer.refer_by_id = updateReferInput.refer_by_id;

      const update = await this.referRepository.save(refer);
      if (refer) {
        return {
          success: true,
          reason: 'Refer Updated Successfully.',
          update,
        };
      }
    } catch (error) {
      return { success: false, reason: 'Error Something.' };
    }
  }

  async removeRefer(id: string) {
    try {
      const data = await this.findOneById(id);
      if (data !== null) {
        await this.referRepository.update(id, {
          status: ReferStatusEnum.DELETED,
        });
        return {
          success: true,
          message: 'The Refer is Deleted Successfully.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `The Refer can't find in database`,
      };
    }
  }
}

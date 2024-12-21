import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateRoleInput } from './dto/create-role';
import { Role } from './entities/role.entities';
import { UpdateRoleInput } from './dto/update-role';
import { CreateRolePayload } from './payload/createRole-payload';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';
import { Roles } from './types/roleList';
import { RoleStatusEnum } from './enum/roleStatus.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleInput): Promise<CreateRolePayload> {
    try {
      await this.roleRepository.save({ role_type: createRoleDto.role_type });
      return {
        reason: 'ROle is Created Successfully',
        success: true,
      };
    } catch (error) {
      return {
        reason:
          error.code === 'ER_DUP_ENTRY'
            ? 'This role is already exist.'
            : 'There is some error creating the role',
        success: false,
      };
    }
  }

  async findAll(
    filters?: any,
    sorts?: SortProps[],
    pageInfo?: PageInfoProps,
  ): Promise<Roles> {
    const where: FindManyOptions<Role>['where'] = {};
    const order: FindManyOptions<Role>['order'] = {};

    if (filters?.id) {
      where['id'] = filters.id;
    }

    if (filters?.role_type) {
      where['role_type'] = filters.role_type;
    }

    if (sorts && sorts.length > 0) {
      sorts.forEach((s) => {
        order[s.sortField] = s.sortOrder;
      });
    }

    const { pageNumber, pageSize } = pageInfo;

    const RoleData = await this.roleRepository.find({
      where: { ...where },
      order: { role_type: 'ASC', ...order },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await this.roleRepository.count({
      where: {
        ...where,
      },
    });

    return {
      data: RoleData,
      pageInfo: {
        pageNumber: pageNumber,
        totalCount: totalCount,
      },
    };
  }

  async findOneById(id: string) {
    return await this.roleRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(updateRoleDto: UpdateRoleInput): Promise<CreateRolePayload> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id: updateRoleDto.id },
      });
      role.role_type = updateRoleDto.role_type || role.role_type;
      await this.roleRepository.save(role);
      return { success: true, role };
    } catch (error) {
      return {
        reason: 'There is some error while updating role',
        success: false,
      };
    }
  }

  async remove(id: string) {
    try {
      await this.roleRepository.update(id, {
        status: RoleStatusEnum.DELETED,
      });
      return {
        message: 'The role has been successfully deleted.',
        success: true,
      };
    } catch (error) {
      return {
        message: 'There is some error deleting the role',
        success: false,
      };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import { Business } from './entities/business.entities';
import { SortProps } from '../args/sorts';
import { PageInfoProps } from '../args/pageInfo';
import { Businesses } from './types/business.list';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async findAll(
    filters?: any,
    sorts?: SortProps[],
    pageInfo?: PageInfoProps,
  ): Promise<Businesses> {
    const where: FindManyOptions<Business>['where'] = {};
    const order: FindManyOptions<Business>['order'] = {};

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

    const userData = await this.businessRepository.find({
      where: { ...where },
      order: { name: 'ASC', ...order },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await this.businessRepository.count({
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

  async save(createData: any): Promise<any> {
    const business = this.businessRepository.create(createData);
    return await this.businessRepository.save(business);
  }

  async findOne(username: string): Promise<Business | undefined> {
    return await this.businessRepository.findOne({
      where: { userName: username },
    });
  }

  async updateBusiness(id: string, updateData: any): Promise<Business> {
    await this.businessRepository.update(id, updateData);
    return this.findOne(id);
  }

  findBusinessByUsername(
    username: string,
    password: string,
  ): Promise<Business> {
    return this.businessRepository.findOne({
      where: {
        userName: username,
        password: password,
      },
    });
  }

  findBusinessById(id: string): Promise<Business> {
    return this.businessRepository.findOne({
      where: { id },
    });
  }
}

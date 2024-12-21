import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Business } from './entities/business.entities';
import { BusinessFilter } from './dto/filter-business';
import { UpdateBusinessInput } from './dto/update-business.input';
import { CreateBusinessInput } from './dto/create-business.input';
import { Businesses } from './types/business.list';
import { BusinessStatusEnum } from '../types/business/business';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';
import { FirebasePayload } from './payload/FireBase.payload';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private service: ConfigService,
  ) {
    this.initializeBaseUrl();
  }

  base_url: string;
  async initializeBaseUrl() {
    this.base_url = await this.service.get('FRONT_END_BASE_URL');
  }

  async create(createBusinessInput: CreateBusinessInput) {
    const business: Business = new Business();

    business.name = createBusinessInput.name;
    business.mobileNumber = createBusinessInput.mobileNumber;
    business.ownerName = createBusinessInput.ownerName;
    business.userName = createBusinessInput.username;
    business.password = createBusinessInput.password;
    business.businessType = createBusinessInput.businessType;
    business.address = createBusinessInput.address;
    business.workingTime = createBusinessInput.workingTime;
    business.tokenLimit = createBusinessInput.token_limit;
    business.status = createBusinessInput.status;
    business.otp = createBusinessInput.otp;
    business.expiredOtp = createBusinessInput.expiredOtp;

    try {
      await this.businessRepository.save(business);
      return {
        success: true,
        reason: 'The new Business has been successfully added.',
      };
    } catch (error) {
      return {
        success: false,
        reason:
          error.code === 'ER_DUP_ENTRY'
            ? 'The Business is already registered in the Token_System.'
            : 'Something went wrong.',
      };
    }
  }

  async verifyOtp(req, res) {
    try {
      const token = req.token;

      const activeAccountRedirectUrl = `${this.base_url}/activate-account?token=${token}`;

      return res.redirect(301, activeAccountRedirectUrl);
    } catch (error) {
      console.error('Error during mobileNumber verification:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  async setBusinessPassword(busnessId: string, password: string) {
    try {
      const result = await this.businessRepository
        .createQueryBuilder()
        .update(Business)
        .set({
          password,
          updatedAt: new Date().toISOString(),
          status: BusinessStatusEnum.ACTIVE,
        })
        .where('id = :id', { id: busnessId })
        .execute();
      return {
        success: true,
        reason: 'Your Password is Updated Successfully.',
        result,
      };
    } catch (error) {
      return {
        success: false,
        reason: `You can't change your password`,
      };
    }
  }

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

  async findOne(filter?: Partial<BusinessFilter>) {
    return await this.businessRepository.findOne({
      where: {
        ...filter,
      },
      relations: ['roles'],
    });
  }

  findBusinessById(id: string): Promise<Business> {
    return this.businessRepository.findOne({
      where: { id },
    });
  }

  async loginStatus(BusinessId: string, isLogin: boolean) {
    try {
      await this.businessRepository.update(BusinessId, { isLogin });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  findBusinessByMobileNumber(
    mobileNumber: string,
    otp: string,
  ): Promise<Business> {
    return this.businessRepository.findOne({
      where: {
        mobileNumber: mobileNumber,
        otp: otp,
      },
    });
  }

  async remove(id: string) {
    try {
      const valid = true;
      await this.businessRepository.update(id, {
        status: BusinessStatusEnum.DELETED,
      });
      return { message: 'The employee has been successfully deleted.', valid };
    } catch (error) {
      return { message: 'Something went to wrong.', valid: false };
    }
  }

  async update(updateBusinessInput: UpdateBusinessInput) {
    try {
      const business: Business = new Business();
      business.id = updateBusinessInput.id;
      business.name = updateBusinessInput.name;
      business.mobileNumber = updateBusinessInput.mobileNumber;
      business.otp = updateBusinessInput.otp;
      business.expiredOtp = updateBusinessInput.expiredOtp;
      business.userName = updateBusinessInput.username;
      business.password = updateBusinessInput.password;
      business.address = updateBusinessInput.address;
      business.businessType = updateBusinessInput.businessType;
      business.ownerName = updateBusinessInput.ownerName;
      business.tokenLimit = updateBusinessInput.token_limit;
      business.workingTime = updateBusinessInput.workingTime;

      const update = await this.businessRepository.save(business);
      if (business) {
        return {
          success: true,
          reason: 'Business Updated Successfully.',
          update,
        };
      }
    } catch (error) {
      return { success: false, reason: 'Error Something.' };
    }
  }
  async setFirebaseToken(business: Business, token: FirebasePayload) {
    const { token: firebaseToken } = token;
    try {
      await this.businessRepository.update(business.id, { firebaseToken });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateBusinessInput } from './dto/create-business.input';
import { UpdateBusinessInput } from './dto/update-business.input';
import { Business } from './entities/business.entities';
import { BusinessService } from './business.service';
import { Businesses } from './types/business.list';
import { BusinessFilter } from './dto/filter-business';
import { UpdateBusinessPayload } from './payload/updateBusieness.payload';
import { RemoveBusinessPayload } from './payload/removeBusieness.payload';
import { CreateBusinessPayload } from './payload/createBusieness.payload';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';
import { MutationResponse } from 'libs/lib/src/payloads/mutationResponse';
import { CurrentBusiness } from './decorators/currentBusiness.decorator';
import { PermissionsGuard } from '../common/guards/permission.gaurd';
import { GqlJwtAuthGuard } from 'libs/auth/gql-jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Business)
@UseGuards(GqlJwtAuthGuard, PermissionsGuard)
export class BusinessResolver {
  constructor(private businessService: BusinessService) {}

  @Query(() => Business, { name: 'CurrentBusiness' })
  currentUser(@CurrentBusiness() user: Business): Promise<Business> {
    return this.businessService.findBusinessById(user?.id);
  }

  @Query(() => Businesses, { name: 'businesses' })
  async businesses(
    @Args('filters', { nullable: true, defaultValue: {} })
    filters: BusinessFilter,
    @Args('sorts', { type: () => [SortProps], nullable: true })
    sorts: SortProps[],
    @Args('pageInfo', {
      type: () => PageInfoProps,
      nullable: true,
      defaultValue: { pageNumber: 1, pageSize: 50 },
    })
    pageInfo: PageInfoProps,
  ): Promise<Businesses> {
    return this.businessService.findAll(filters, sorts, pageInfo);
  }

  @Query(() => Business, { name: 'business' })
  async findOnebusiness(
    @Args('filter', { nullable: true }) filter: BusinessFilter,
  ): Promise<Business> {
    return this.businessService.findOne(filter);
  }

  @Query(() => Business, { name: 'businessWithAccess' })
  findBusinessById(@Args('businessId') businessId: string): Promise<Business> {
    return this.businessService.findBusinessById(businessId);
  }

  @Mutation(() => CreateBusinessPayload, { name: 'createBusiness' })
  createBusiness(@Args('input') createBusinessInput: CreateBusinessInput) {
    return this.businessService.create(createBusinessInput);
  }

  @Mutation(() => UpdateBusinessPayload, { name: 'updateBusiness' })
  updateBusiness(@Args('input') updateBusinessInput: UpdateBusinessInput) {
    return this.businessService.update(updateBusinessInput);
  }

  @Mutation(() => UpdateBusinessPayload, { name: 'setBusinessPassword' })
  setBusinessPassword(
    @Args('input') updateBusinessInput: UpdateBusinessInput,
    @Args('businessId') businessId: string,
  ) {
    return this.businessService.setBusinessPassword(
      businessId,
      updateBusinessInput.password,
    );
  }

  @Mutation(() => UpdateBusinessPayload, { name: 'updateBusinessProfile' })
  updateBusinessProfile(
    @Args('input') updateBusinessInput: UpdateBusinessInput,
  ) {
    return this.businessService.update(updateBusinessInput);
  }

  @Mutation(() => RemoveBusinessPayload, { name: 'removeBusiness' })
  removeBusiness(@Args('id') id: string) {
    return this.businessService.remove(id);
  }

  @Mutation(() => MutationResponse)
  logoutBusiness(business: Business) {
    return this.businessService.loginStatus(business.id, false);
  }
}

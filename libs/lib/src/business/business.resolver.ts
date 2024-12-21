import { Args, Query, Resolver } from '@nestjs/graphql';
import { Business } from './entities/business.entities';
import { BusinessService } from './business.service';
import { Businesses } from './types/business.list';
import { BusinessFilter } from './dto/filter-business';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';

@Resolver(() => Business)
export class BusinessResolver {
  constructor(private businessService: BusinessService) {}

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

  @Query(() => Business, { name: 'businessWithAccess' })
  findBusinessById(@Args('businessId') businessId: string): Promise<Business> {
    return this.businessService.findBusinessById(businessId);
  }
}

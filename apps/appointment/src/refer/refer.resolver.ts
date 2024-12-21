import { ReferFilter } from './dto/filter-refers';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateReferInput } from './dto/create-refer.input';
import { UpdateReferInput } from './dto/update-refer.input';

import { Refer } from './entities/refer.entities';
import { ReferService } from './refer.service';
import { CreateReferPayload } from './payload/createRefer.payload';
import { UpdateReferPayload } from './payload/updateRefer.payload';
import { RemoveReferPayload } from './payload/removeRefer.payload';
import { Refers } from './types/referList';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';
import { User } from '../user/entities/user.entities';

@Resolver(() => Refer)
export class ReferResolver {
  constructor(private referService: ReferService) {}

  @Query(() => [Refer])
  async findOneById(@Args('id') id: string): Promise<Refer> {
    return await this.referService.findOneById(id);
  }

  @Query(() => Refers, { name: 'refers' })
  async refers(
    @Args('filters', { nullable: true, defaultValue: {} })
    filters: ReferFilter,
    @Args('sorts', { type: () => [SortProps], nullable: true })
    sorts: SortProps[],
    @Args('pageInfo', {
      type: () => PageInfoProps,
      nullable: true,
      defaultValue: { pageNumber: 1, pageSize: 50 },
    })
    pageInfo: PageInfoProps,
    user: User,
  ): Promise<Refers> {
    return this.referService.findAll(user, filters, sorts, pageInfo);
  }

  @Mutation(() => CreateReferPayload, { name: 'createRefer' })
  createRefer(
    @Args('input') createReferInput: CreateReferInput,
    userId: string,
  ) {
    return this.referService.create(createReferInput, userId);
  }

  @Mutation(() => UpdateReferPayload, { name: 'updateRefer' })
  updateRefer(@Args('input') updateReferInput: UpdateReferInput) {
    return this.referService.update(updateReferInput);
  }

  @Mutation(() => RemoveReferPayload)
  async removeRefer(@Args('id') id: string): Promise<any> {
    return await this.referService.removeRefer(id);
  }
}

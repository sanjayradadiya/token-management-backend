import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMemberInput } from './dto/create-member.input';
import { UpdateMemberInput } from './dto/update-member.input';

import { Member } from './entities/member.entities';
import { MemberService } from './member.service';
import { MemberFilter } from './dto/filter-member';
import { Members } from './types/memberList';
import { CreateMemberPayload } from './payload/createMember.payload';
import { UpdateMemberPayload } from './payload/updateMember.payload';
import { RemoveMemberPayload } from './payload/removeMember.payload';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';
import { CurrentUser } from '../user/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entities';

@Resolver(() => Member)
export class MemberResolver {
  constructor(private memberService: MemberService) {}

  @Mutation(() => CreateMemberPayload, { name: 'createMember' })
  createMember(
    @Args('input') createMemberInput: CreateMemberInput,
    @Args('userId') userId: string,
  ) {
    return this.memberService.create(createMemberInput, userId);
  }

  @Mutation(() => UpdateMemberPayload, { name: 'updateMember' })
  updateMember(@Args('input') updateMemberInput: UpdateMemberInput) {
    return this.memberService.update(updateMemberInput);
  }

  @Query(() => [Member])
  async findMatchingUserAndMemberNames(): Promise<Member[]> {
    return this.memberService.findMatchingUserAndMemberNames();
  }

  @Query(() => Members, { name: 'members' })
  async members(
    @Args('filters', { nullable: true, defaultValue: {} })
    filters: MemberFilter,
    @Args('sorts', { type: () => [SortProps], nullable: true })
    sorts: SortProps[],
    @Args('pageInfo', {
      type: () => PageInfoProps,
      nullable: true,
      defaultValue: { pageNumber: 1, pageSize: 50 },
    })
    pageInfo: PageInfoProps,
    @CurrentUser()
    user: User,
  ): Promise<Members> {
    return this.memberService.findAll(user, filters, sorts, pageInfo);
  }

  @Query(() => Member)
  async findMemberById(@Args('id') id: string): Promise<Member> {
    return await this.memberService.findOneById(id);
  }

  @Query(() => [Member])
  async getMemberByUserId(@Args('userId') userId: string): Promise<Member[]> {
    return await this.memberService.getAllByUserId(userId);
  }

  @Mutation(() => RemoveMemberPayload)
  async removeMember(@Args('id') id: string): Promise<any> {
    return await this.memberService.removeMember(id);
  }
}

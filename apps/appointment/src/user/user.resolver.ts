import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SuccessType } from '../common/resolver/resolver';
import { User } from './entities/user.entities';
import { UserService } from './user.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { PermissionsGuard } from '../common/guards/permission.gaurd';
import { Users } from './types/userList';
import { UserFilter } from './dto/filter-user';
import { UpdateUserPayload } from './payload/updateUser.payload';
import { CreateUserPayload } from './payload/createUser.payload';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';
import { GqlJwtAuthGuard } from 'libs/auth/gql-jwt-auth.guard';
import { JwtStrategy } from 'libs/auth/jwt.strategy';

@Resolver(() => User)
@UseGuards(GqlJwtAuthGuard, PermissionsGuard)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { name: 'CurrentUser' })
  currentUser(@CurrentUser() user: User): Promise<User> {
    return this.userService.findUserById(user?.id);
  }

  @Query(() => User, { name: 'findUserById' })
  findUserById(user: User): Promise<User> {
    return this.userService.findUserById(user?.id);
  }

  @Query(() => User, { name: 'findUserByMobileNumber' })
  findUserByMobileNumber(user: User): Promise<User> {
    return this.userService.findUserByMobileNumber(
      user?.mobileNumber,
      user?.otp,
    );
  }

  @Query(() => Users, { name: 'users' })
  async user(
    @Args('filters', { nullable: true, defaultValue: {} })
    filters: UserFilter,
    @Args('sorts', { type: () => [SortProps], nullable: true })
    sorts: SortProps[],
    @Args('pageInfo', {
      type: () => PageInfoProps,
      nullable: true,
      defaultValue: { pageNumber: 1, pageSize: 50 },
    })
    pageInfo: PageInfoProps,
  ): Promise<Users> {
    return this.userService.findAll(filters, sorts, pageInfo);
  }

  @UseGuards(JwtStrategy)
  @Mutation(() => CreateUserPayload, { name: 'createUser' })
  createUser(@Args('input') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => CreateUserPayload, { name: 'createOTP' })
  createOTP(@Args('input') mobileNumber: string) {
    return this.userService.createOtp(mobileNumber);
  }

  @Mutation(() => CreateUserPayload, { name: 'verifyOTP' })
  verifyOTP(@Args('input') mobileNumber: string, otp: string) {
    return this.userService.verifyOtp(mobileNumber, otp);
  }

  @Mutation(() => UpdateUserPayload, { name: 'updateUser' })
  updateUser(@Args('input') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput);
  }

  @Mutation(() => SuccessType)
  logout(user: User) {
    return this.userService.loginStatus(user.id, false);
  }
}

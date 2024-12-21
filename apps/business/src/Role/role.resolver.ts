import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRoleInput } from './dto/create-role';
import { Role } from './entities/role.entities';
import { RoleService } from './role.service';
import { UpdateRoleInput } from './dto/update-role';
import { CreateRolePayload } from './payload/createRole-payload';
import { UpdateRolePayload } from './payload/updateRole-payload';
import { DeleteRolePayload } from './payload/deleteRole-payload';
import { Roles } from './types/roleList';
import { RoleFilters } from './filter/role-filter';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  @Mutation(() => CreateRolePayload, { name: 'createRole' })
  createRole(@Args('input') createRoleInput: CreateRoleInput) {
    return this.roleService.create(createRoleInput);
  }

  @Mutation(() => UpdateRolePayload, { name: 'updateRole' })
  updateRole(@Args('input') updateRoleDto: UpdateRoleInput) {
    return this.roleService.update(updateRoleDto);
  }

  @Mutation(() => DeleteRolePayload)
  removeRole(@Args('id', { type: () => String }) id: string) {
    return this.roleService.remove(id);
  }

  @Query(() => Role, { name: 'findRoleById' })
  findRoleById(role: Role): Promise<Role> {
    return this.roleService.findOneById(role?.id);
  }

  @Query(() => Roles, { name: 'roles' })
  async user(
    @Args('filters', { nullable: true, defaultValue: {} })
    filters: RoleFilters,
    @Args('sorts', { type: () => [SortProps], nullable: true })
    sorts: SortProps[],
    @Args('pageInfo', {
      type: () => PageInfoProps,
      nullable: true,
      defaultValue: { pageNumber: 1, pageSize: 50 },
    })
    pageInfo: PageInfoProps,
  ): Promise<Roles> {
    return this.roleService.findAll(filters, sorts, pageInfo);
  }
}

import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';

export const CREATE_ROLES_200: ApiResponseOptions = {
  status: 200,
  description: 'Create Role',
  content: {
    'application/json': {
      example: {
        message: 'Role Created successfully',
        data: {
          role_type: 'USER',
          is_active: true,
          id: '52ed4bc1-ca4b-4e5c-8511-56cec5edd43f',
        },
      },
    },
  },
};

export const GET_ROLES_200: ApiResponseOptions = {
  status: 200,
  description: 'Get Roles',
  content: {
    'application/json': {
      example: {
        data: {
          roles: [],
        },
      },
    },
  },
};

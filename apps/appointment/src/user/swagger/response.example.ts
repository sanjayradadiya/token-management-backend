import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';

export const REGISTER_400: ApiResponseOptions = {
  status: 400,
  description: 'User register',
  content: {
    'application/json': {
      example: {
        statusCode: 400,
        message: 'User already exists',
        error: 'Bad Request',
      },
    },
  },
};

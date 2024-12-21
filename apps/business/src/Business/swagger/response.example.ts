import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';

export const REGISTER_400: ApiResponseOptions = {
  status: 400,
  description: 'BUsiness register',
  content: {
    'application/json': {
      example: {
        statusCode: 400,
        message: 'Business already exists',
        error: 'Bad Request',
      },
    },
  },
};

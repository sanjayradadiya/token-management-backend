import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { graphqlUploadExpress } from 'graphql-upload';
import { LoginModule } from './login.module';
import * as bodyParser from 'body-parser';

function setupSwagger(app: NestExpressApplication) {
  const options = new DocumentBuilder()
    .setTitle('Token_system API')
    .setDescription('Token_system API')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      description: 'Valid JWT Token',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Token_system API',
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(LoginModule);

  // Use body parser middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Set up file upload and static assets
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 4 * 1024 * 1024, maxFiles: 10 }),
  );
  app.useStaticAssets(join(process.cwd(), './src/uploads'));

  // Set up Swagger documentation
  setupSwagger(app);

  // Enable CORS
  app.enableCors();

  await app.listen(3003);
}

bootstrap();

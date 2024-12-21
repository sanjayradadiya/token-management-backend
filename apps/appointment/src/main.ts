import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { graphqlUploadExpress } from 'graphql-upload';

function setupSwagger(app) {
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
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 4 * 1024 * 1024, maxFiles: 10 }),
  );
  app.useStaticAssets(join(process.cwd(), './src/uploads'));
  setupSwagger(app);
  app.enableCors();
  await app.listen(3001);
}

bootstrap();
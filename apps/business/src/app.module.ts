import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { BusinessModule } from './Business/business.module';
import { RoleModule } from './Role/role.module';
import { PermissionsGuard } from './common/guards/permission.gaurd';
import { Business } from './Business/entities/business.entities';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: './schema.gql',
      sortSchema: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          synchronize: true,
          entities: [Business],
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
    BusinessModule,
    RoleModule,
  ],
  providers: [PermissionsGuard],
})
export class AppModule {}

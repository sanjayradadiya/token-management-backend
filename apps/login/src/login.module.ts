import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginResolver } from './login.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessModule, UserModule } from 'libs/lib/src';
import { Business } from 'libs/lib/src/business/entities/business.entities';
import { User } from 'libs/lib/src/user/entities/user.entities';
import {
  AppConfigs,
  AuthService,
  JWTConstants,
  LocalStrategy,
  PasswordManagerHelperClass,
  TokenManagerHelperClass,
  UserValidatorsHelperClass,
} from 'libs/auth';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    BusinessModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: JWTConstants.secret,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './schema.gql',
      playground: true,
      sortSchema: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: true,
        entities: [Business, User],
        logging: false,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AppConfigs,
    ConfigService,
    LoginService,
    LoginResolver,
    LocalStrategy,
    AuthService,
    TokenManagerHelperClass,
    PasswordManagerHelperClass,
    UserValidatorsHelperClass,
  ],
  exports: [LoginService],
})
export class LoginModule {}

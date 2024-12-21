import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
import { User } from './user/entities/user.entities';
import { Member } from './member/entities/member.entities';
import { Refer } from './refer/entities/refer.entities';
import { ReferModule } from './refer/refer.module';
import { Appointment } from './appointment/entities/appointment.entities';
import { AppointmentModule } from './appointment/appointment.module';
import { Business } from 'libs/lib/src/business/entities/business.entities';
import { AppConfigs, AuthModule } from 'libs/auth';
import { PermissionsGuard } from './common/guards/permission.gaurd';

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
          entities: [User, Member, Refer, Appointment, Business],
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    MemberModule,
    ReferModule,
    AppointmentModule,
    AuthModule,
  ],
  providers: [AppConfigs, PermissionsGuard],
  exports: [AuthModule],
})
export class AppModule {}

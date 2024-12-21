import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigs {
  constructor(private service: ConfigService) {}

  get(key: string): any {
    return this.service.get(key);
  }

  jwtAuthSecret(): string {
    const authSecret = this.get('JWT_SECRET');

    if (!authSecret) {
      throw new Error(`auth jwt token not found ${__filename}`);
    }

    return authSecret;
  }
}

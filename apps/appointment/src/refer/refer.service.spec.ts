import { Test, TestingModule } from '@nestjs/testing';
import { ReferService } from './refer.service';

describe('ReferService', () => {
  let service: ReferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferService],
    }).compile();

    service = module.get<ReferService>(ReferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

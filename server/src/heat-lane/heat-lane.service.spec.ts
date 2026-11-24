import { Test, TestingModule } from '@nestjs/testing';
import { HeatLaneService } from './heat-lane.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HeatLaneService', () => {
  let service: HeatLaneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeatLaneService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<HeatLaneService>(HeatLaneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { RaceService } from './race.service';
import { PrismaService } from '../prisma/prisma.service';
import { RaceProgressionService } from './services/race-progression.service';
import { RaceGenerationService } from './services/race-generation.service';
import { CompetitionService } from '../competition/competition.service';

describe('RaceService', () => {
  let service: RaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RaceService,
        { provide: PrismaService, useValue: {} },
        { provide: RaceProgressionService, useValue: {} },
        { provide: RaceGenerationService, useValue: {} },
        { provide: CompetitionService, useValue: {} },
      ],
    }).compile();

    service = module.get<RaceService>(RaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

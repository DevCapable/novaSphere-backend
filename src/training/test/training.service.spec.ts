import { Test, TestingModule } from '@nestjs/testing';
import { TrainingService } from '../training.service';

describe('TrainingService', () => {
  let training: TrainingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingService],
    }).compile();

    training = module.get<TrainingService>(TrainingService);
  });

  it('should be defined', () => {
    expect(training).toBeDefined();
  });
});

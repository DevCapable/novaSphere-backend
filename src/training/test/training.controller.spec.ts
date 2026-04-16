import { Test, TestingModule } from '@nestjs/testing';
import { TrainingService } from '../training.service';
import { TrainingController } from '@app/training/trainings.controller';

describe('ServiceController', () => {
  let controller: TrainingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingController],
      providers: [TrainingService],
    }).compile();

    controller = module.get<TrainingController>(TrainingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

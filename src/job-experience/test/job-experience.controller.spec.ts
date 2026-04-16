import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from '../service.controller';
import { JobExperienceService } from '../job-experience.service';

describe('ServiceController', () => {
  let controller: ServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [JobExperienceService],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

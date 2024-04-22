import { Test, TestingModule } from '@nestjs/testing';
import { LanguageModelService } from './language-model.service';

describe('LanguageModelService', () => {
  let service: LanguageModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LanguageModelService],
    }).compile();

    service = module.get<LanguageModelService>(LanguageModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

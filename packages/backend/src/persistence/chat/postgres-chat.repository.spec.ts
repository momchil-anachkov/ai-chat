import { Test, TestingModule } from '@nestjs/testing';
import { PostgresChatRepository } from './postgres-chat.repository';

describe('ChatService', () => {
  let service: PostgresChatRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgresChatRepository],
    }).compile();

    service = module.get<PostgresChatRepository>(PostgresChatRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

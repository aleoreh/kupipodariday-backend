import { Test, TestingModule } from '@nestjs/testing';
import { WhishlistsService } from './whishlists.service';

describe('WhishlistsService', () => {
  let service: WhishlistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhishlistsService],
    }).compile();

    service = module.get<WhishlistsService>(WhishlistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

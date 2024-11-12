import { Test, TestingModule } from '@nestjs/testing';
import { WhishlistsController } from './whishlists.controller';
import { WhishlistsService } from './whishlists.service';

describe('WhishlistsController', () => {
  let controller: WhishlistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhishlistsController],
      providers: [WhishlistsService],
    }).compile();

    controller = module.get<WhishlistsController>(WhishlistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

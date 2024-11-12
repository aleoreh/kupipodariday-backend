import { Module } from '@nestjs/common';
import { WhishlistsService } from './whishlists.service';
import { WhishlistsController } from './whishlists.controller';

@Module({
  controllers: [WhishlistsController],
  providers: [WhishlistsService],
})
export class WhishlistsModule {}

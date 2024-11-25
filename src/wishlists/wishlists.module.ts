import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainErrorHandler } from '../errors/domain-error-handler.service';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist]),
    TypeOrmModule.forFeature([Wish]),
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService, DomainErrorHandler],
  exports: [WishlistsService],
})
export class WishlistsModule {}

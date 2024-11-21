import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { DomainErrorHandler } from '../exceptions/domain-error-handler.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wish]), TypeOrmModule.forFeature([User])],
  controllers: [WishesController],
  providers: [WishesService, DomainErrorHandler],
  exports: [WishesService],
})
export class WishesModule {}

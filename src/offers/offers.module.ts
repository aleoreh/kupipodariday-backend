import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainErrorHandler } from '../errors/domain-error-handler.service';
import { User } from '../users/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [OffersController],
  providers: [OffersService, DomainErrorHandler],
  exports: [OffersService],
})
export class OffersModule {}

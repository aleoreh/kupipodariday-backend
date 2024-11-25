import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainErrorHandler } from '../errors/domain-error-handler.service';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Wish])],
  controllers: [UsersController],
  providers: [UsersService, DomainErrorHandler],
  exports: [UsersService],
})
export class UsersModule {}

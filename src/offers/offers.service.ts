import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    return this.userRepository.findOneBy({ id: userId }).then((user) => {
      const wish = this.offerRepository.create({
        ...createOfferDto,
        user,
      });
      return this.offerRepository.save(wish);
    });
  }

  async findAll() {
    return this.offerRepository.find();
  }

  async findOne(id: number) {
    return this.offerRepository.findOneBy({ id });
  }

  async update(id: number, updateOfferDto: UpdateOfferDto) {
    return this.offerRepository.update({ id }, updateOfferDto);
  }

  async remove(id: number) {
    return this.offerRepository.delete({ id });
  }
}

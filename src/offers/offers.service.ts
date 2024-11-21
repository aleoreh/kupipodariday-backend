import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    return Promise.all([
      this.userRepository.findOneBy({ id: userId }),
      this.wishRepository.findOneBy({ id: createOfferDto.itemId }),
    ]).then(([user, item]) => {
      const offer = this.offerRepository.create({
        ...createOfferDto,
        item,
        user,
      });
      return this.offerRepository.save(offer);
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

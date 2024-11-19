import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    return this.userRepository.findOneBy({ id: userId }).then((user) => {
      const wish = this.wishRepository.create({
        ...createWishDto,
        owner: user,
      });
      return this.wishRepository.save(wish);
    });
  }

  async findAll() {
    return this.wishRepository.find();
  }

  async findOne(id: number) {
    return this.wishRepository.findOneBy({ id });
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    return this.wishRepository.update({ id }, updateWishDto);
  }

  async remove(id: number) {
    return this.wishRepository.delete({ id });
  }
}

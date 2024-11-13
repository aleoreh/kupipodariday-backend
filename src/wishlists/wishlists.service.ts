import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-whishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    return this.wishlistRepository.create(createWishlistDto);
  }

  async findAll() {
    return this.wishlistRepository.find();
  }

  async findOne(id: number) {
    return this.wishlistRepository.findOneBy({ id });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistRepository.update({ id }, updateWishlistDto);
  }

  async remove(id: number) {
    return this.wishlistRepository.delete({ id });
  }
}

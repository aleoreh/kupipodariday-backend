import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-whishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,

    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    const wishlist = this.wishlistRepository.create(createWishlistDto);

    const items = await this.wishRepository.find({
      where: { id: In(createWishlistDto.itemsId) },
    });

    return this.wishlistRepository.save({ ...wishlist, items });
  }

  async findAll() {
    return this.wishlistRepository.find();
  }

  async findOne(id: number) {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: { items: true },
    });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistRepository.update({ id }, updateWishlistDto);
  }

  async remove(id: number) {
    return this.wishlistRepository.delete({ id });
  }
}

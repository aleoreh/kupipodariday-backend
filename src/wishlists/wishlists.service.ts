import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-whishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { AccessDeniedError } from '../errors/access-denied.error';

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

    const { id } = await this.wishlistRepository.save({ ...wishlist, items });
    return this.findOne(id);
  }

  async findAll() {
    return this.wishlistRepository.find({ relations: { items: true } });
  }

  async findOne(id: number) {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: { items: true },
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne(id);

    if (wishlist.user.id !== userId)
      throw new AccessDeniedError('Нельзя редактировать чужую подборку');

    const items = await this.wishRepository.find({
      where: { id: In(updateWishlistDto.itemsId) },
    });

    await this.wishlistRepository.save({
      ...wishlist,
      ...updateWishlistDto,
      items,
    });
    return this.findOne(id);
  }

  async remove(id: number, userId: number) {
    const wishlist = await this.findOne(id);

    if (wishlist.user.id !== userId)
      throw new AccessDeniedError('Нельзя удалять чужую подборку');

    return this.wishlistRepository.delete({ id });
  }
}

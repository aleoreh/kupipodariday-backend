import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-whishlist.dto';

@Injectable()
export class WishlistsService {
  create(createWhishlistDto: CreateWishlistDto) {
    return 'This action adds a new whishlist';
  }

  findAll() {
    return `This action returns all whishlists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} whishlist`;
  }

  update(id: number, updateWhishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} whishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} whishlist`;
  }
}

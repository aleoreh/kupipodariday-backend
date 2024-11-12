import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-whishlist.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() createWhishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWhishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWhishlistDto: UpdateWishlistDto) {
    return this.wishlistsService.update(+id, updateWhishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistsService.remove(+id);
  }
}

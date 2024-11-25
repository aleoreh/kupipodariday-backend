import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-whishlist.dto';
import { DomainErrorHandler } from '../errors/domain-error-handler.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly errorHandler: DomainErrorHandler,
  ) {}

  @Post()
  create(@Body() createWhishlistDto: CreateWishlistDto) {
    return this.wishlistsService
      .create(createWhishlistDto)
      .catch(this.errorHandler.toHttp);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll().catch(this.errorHandler.toHttp);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id).catch(this.errorHandler.toHttp);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWhishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService
      .update(+id, updateWhishlistDto)
      .catch(this.errorHandler.toHttp);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistsService.remove(+id).catch(this.errorHandler.toHttp);
  }
}

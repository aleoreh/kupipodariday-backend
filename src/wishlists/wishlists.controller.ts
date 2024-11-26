import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DomainErrorHandler } from '../errors/domain-error-handler.service';
import { JwtGuard } from '../jwt/jwt.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-whishlist.dto';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly errorHandler: DomainErrorHandler,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWhishlistDto: CreateWishlistDto) {
    return this.wishlistsService
      .create(createWhishlistDto)
      .catch(this.errorHandler.toHttp);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishlistsService.findAll().catch(this.errorHandler.toHttp);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id).catch(this.errorHandler.toHttp);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWhishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService
      .update(+id, updateWhishlistDto, req.user.id)
      .catch(this.errorHandler.toHttp);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.wishlistsService
      .remove(+id, req.user.id)
      .catch(this.errorHandler.toHttp);
  }
}

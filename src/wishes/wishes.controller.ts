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
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly exceptionHandler: DomainErrorHandler,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService
      .create(createWishDto, req.user.id)
      .catch(this.exceptionHandler.toHttp);
  }

  @UseGuards(JwtGuard)
  @Get('last')
  getLast() {
    return this.wishesService.findLast().catch(this.exceptionHandler.toHttp);
  }

  @UseGuards(JwtGuard)
  @Get('top')
  getTop() {
    return this.wishesService.findTop().catch(this.exceptionHandler.toHttp);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id).catch(this.exceptionHandler.toHttp);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService
      .update(+id, updateWishDto, req.user.id)
      .catch(this.exceptionHandler.toHttp);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.wishesService
      .remove(+id, req.user.id)
      .catch(this.exceptionHandler.toHttp);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Req() req, @Param('id') id: number) {
    return this.wishesService
      .copy(id, req.user.id)
      .catch(this.exceptionHandler.toHttp);
  }
}

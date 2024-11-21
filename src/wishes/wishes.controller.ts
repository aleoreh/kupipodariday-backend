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
import { DomainExceptionHandler } from '../exceptions/domain-exception-handler.service';
import { JwtGuard } from '../jwt/jwt.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly exceptionHandler: DomainExceptionHandler,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get('last')
  getLast() {
    return this.wishesService.findAll();
  }

  @Get('top')
  getTop() {
    return this.wishesService.findAll();
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
      .catch((err) => {
        throw this.exceptionHandler.toHttpException(err);
      });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.wishesService.remove(+id).catch((err) => {
      throw this.exceptionHandler.toHttpException(err);
    });
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }
}

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
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OffersService } from './offers.service';
import { JwtGuard } from '../jwt/jwt.guard';
import { DomainErrorHandler } from '../errors/domain-error-handler.service';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly errorHandler: DomainErrorHandler,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService
      .create(createOfferDto, req.user.id)
      .catch(this.errorHandler.toHttp);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(+id, updateOfferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offersService.remove(+id);
  }
}

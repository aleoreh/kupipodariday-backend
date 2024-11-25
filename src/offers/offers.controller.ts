import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DomainErrorHandler } from '../errors/domain-error-handler.service';
import { JwtGuard } from '../jwt/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

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
    return this.offersService.findAll().catch(this.errorHandler.toHttp);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id).catch(this.errorHandler.toHttp);
  }
}

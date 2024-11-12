import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WhishlistsService } from './whishlists.service';
import { CreateWhishlistDto } from './dto/create-whishlist.dto';
import { UpdateWhishlistDto } from './dto/update-whishlist.dto';

@Controller('whishlists')
export class WhishlistsController {
  constructor(private readonly whishlistsService: WhishlistsService) {}

  @Post()
  create(@Body() createWhishlistDto: CreateWhishlistDto) {
    return this.whishlistsService.create(createWhishlistDto);
  }

  @Get()
  findAll() {
    return this.whishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whishlistsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWhishlistDto: UpdateWhishlistDto) {
    return this.whishlistsService.update(+id, updateWhishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.whishlistsService.remove(+id);
  }
}

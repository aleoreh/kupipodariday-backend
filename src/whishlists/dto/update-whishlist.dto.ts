import { PartialType } from '@nestjs/mapped-types';
import { CreateWhishlistDto } from './create-whishlist.dto';

export class UpdateWhishlistDto extends PartialType(CreateWhishlistDto) {}

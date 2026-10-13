import { PartialType } from '@nestjs/swagger';
import { CreateWhenDto } from './create-when.dto.js';

export class UpdateWhenDto extends PartialType(CreateWhenDto) {}

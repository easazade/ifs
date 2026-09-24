import { PartialType } from '@nestjs/swagger';
import { CreateChangeItemDto } from './create-change-item.dto.js';

export class UpdateChangeItemDto extends PartialType(CreateChangeItemDto) {}

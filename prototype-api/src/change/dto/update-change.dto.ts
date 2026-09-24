import { PartialType } from '@nestjs/swagger';
import { CreateChangeDto } from './create-change.dto.js';

export class UpdateChangeDto extends PartialType(CreateChangeDto) {}

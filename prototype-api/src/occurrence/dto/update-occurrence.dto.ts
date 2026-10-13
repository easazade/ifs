import { PartialType } from '@nestjs/swagger';
import { CreateOccurrenceDto } from './create-occurrence.dto.js';

export class UpdateOccurrenceDto extends PartialType(CreateOccurrenceDto) {}

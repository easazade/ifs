import { PartialType } from '@nestjs/swagger';
import { CreateRecurrenceDto } from './create-recurrence.dto.js';

export class UpdateRecurrenceDto extends PartialType(CreateRecurrenceDto) {}

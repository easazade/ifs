import { PartialType } from '@nestjs/swagger';
import { CreateGeographicAreaDto } from './create-geographic-area.dto.js';

export class UpdateGeographicAreaDto extends PartialType(
  CreateGeographicAreaDto,
) {}

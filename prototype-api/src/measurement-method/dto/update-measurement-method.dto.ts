import { PartialType } from '@nestjs/swagger';
import { CreateMeasurementMethodDto } from './create-measurement-method.dto.js';

export class UpdateMeasurementMethodDto extends PartialType(
  CreateMeasurementMethodDto,
) {}

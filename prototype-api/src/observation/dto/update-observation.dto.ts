import { PartialType } from '@nestjs/swagger';
import { CreateObservationDto } from './create-observation.dto.js';

export class UpdateObservationDto extends PartialType(CreateObservationDto) {}

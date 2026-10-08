import { PartialType } from '@nestjs/swagger';
import { CreateRelationshipTypeDto } from './create-relationship-type.dto.js';

export class UpdateRelationshipTypeDto extends PartialType(
  CreateRelationshipTypeDto,
) {}

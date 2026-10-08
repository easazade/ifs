import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateRelationshipDto } from './create-relationship.dto.js';

export class UpdateRelationshipDto extends PartialType(
  OmitType(CreateRelationshipDto, ['sourceId', 'targetId'] as const),
) {}

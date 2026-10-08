import { PartialType } from '@nestjs/swagger';
import { CreateRelationshipDto } from './create-relationship.dto.js';

export class UpdateRelationshipDto extends PartialType(CreateRelationshipDto) {}

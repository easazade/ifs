import { PartialType } from '@nestjs/swagger';
import { CreateDecisionDto } from './create-decision.dto.js';

export class UpdateDecisionDto extends PartialType(CreateDecisionDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateScopeDto } from './create-scope.dto.js';

export class UpdateScopeDto extends PartialType(CreateScopeDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateDelegationDto } from './create-delegation.dto.js';

export class UpdateDelegationDto extends PartialType(CreateDelegationDto) {}

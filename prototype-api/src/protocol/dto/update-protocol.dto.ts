import { PartialType } from '@nestjs/swagger';
import { CreateProtocolDto } from './create-protocol.dto.js';

export class UpdateProtocolDto extends PartialType(CreateProtocolDto) {}

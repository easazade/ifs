import { PartialType } from '@nestjs/swagger';
import { CreateVoteDto } from './create-vote.dto.js';

export class UpdateVoteDto extends PartialType(CreateVoteDto) {}

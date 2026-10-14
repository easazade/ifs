import { PartialType } from '@nestjs/swagger';
import { CreateForumDto } from './create-forum.dto.js';

export class UpdateForumDto extends PartialType(CreateForumDto) {}

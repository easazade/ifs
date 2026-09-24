import { PartialType } from '@nestjs/swagger';
import { CreateReviewCommentDto } from './create-review-comment.dto.js';

export class UpdateReviewCommentDto extends PartialType(
  CreateReviewCommentDto,
) {}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChangeItemResponseDto } from '../../change-item/dto/change-item-response.dto.js';
import { CommentResponseDto } from '../../comment/dto/comment-response.dto.js';
import { DecisionResponseDto } from '../../decision/dto/decision-response.dto.js';
import { MemberResponseDto } from '../../member/dto/member-response.dto.js';
import { ReviewCommentResponseDto } from '../../review-comment/dto/review-comment-response.dto.js';

export class ChangeResponseDto {
  @ApiProperty({ description: 'Globally unique identifier for this change.' })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this Change.' })
  ifsId: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Change" for Change entities.',
    enum: ['Change'],
  })
  entityType: 'Change';

  @ApiPropertyOptional({
    description: 'Id of the object this object is derived from.',
  })
  basedOn?: string;

  @ApiProperty({
    description: 'URL for documentation about this entity.',
    format: 'uri',
  })
  entityDocumentationUrl: string;

  @ApiProperty({
    description: 'Human-readable title summarizing the proposed change.',
  })
  title: string;

  @ApiProperty({
    description:
      'Detailed explanation of what this change proposes and why it is needed.',
  })
  description: string;

  @ApiPropertyOptional({
    description:
      'Short explanation of what this change proposes and why it is needed.',
  })
  summary?: string;

  @ApiProperty({
    description: 'explanation of why this change is being proposed.',
  })
  reason: string;

  @ApiProperty({
    description:
      'ChangeItem entities describing each proposed object-level operation in this change.',
    type: () => [ChangeItemResponseDto],
  })
  changes: Array<ChangeItemResponseDto>;

  @ApiPropertyOptional({
    description: 'Current decision about this change',
    type: () => DecisionResponseDto,
  })
  decision?: DecisionResponseDto;

  @ApiPropertyOptional({
    description:
      'Recent Comment entities for this change, such as the first page of comments.',
    type: () => [CommentResponseDto],
  })
  comments?: Array<CommentResponseDto>;

  @ApiPropertyOptional({
    description:
      'URL where the full comment thread for this change can be fetched or viewed.',
    format: 'uri',
  })
  commentsUrl?: string;

  @ApiPropertyOptional({
    description:
      'ReviewComment entities tied to changed objects, fields, records, or diff entries.',
    type: () => [ReviewCommentResponseDto],
  })
  reviewComments?: Array<ReviewCommentResponseDto>;

  @ApiProperty({
    description: 'Member entities that authored or co-authored this change.',
    type: () => [MemberResponseDto],
  })
  authors: Array<MemberResponseDto>;

  @ApiProperty({
    description:
      'Identifier of the primary member responsible for this change.',
  })
  mainAuthorId: string;

  @ApiProperty({
    description: 'Primary member responsible for this change.',
    type: () => MemberResponseDto,
  })
  mainAuthor: MemberResponseDto;

  @ApiPropertyOptional({
    description: 'Member entities requested or assigned to review this change.',
    type: () => [MemberResponseDto],
  })
  reviewers?: Array<MemberResponseDto>;

  @ApiProperty({
    description: 'Lifecycle status of the change.',
    enum: ['drafted', 'closed', 'open', 'rejected', 'approved', 'merged'],
  })
  status: 'drafted' | 'closed' | 'open' | 'rejected' | 'approved' | 'merged';

  @ApiPropertyOptional({
    description:
      'URL showing a diff for all changed objects, similar to a GitHub pull request diff.',
    format: 'uri',
  })
  diffUrl?: string;

  @ApiProperty({
    description:
      'Human-friendly sequence number for this change inside the relevant system or scope.',
    minimum: 1,
  })
  number: number;

  @ApiPropertyOptional({
    description: 'Label assigned to this change.',
    type: [String],
  })
  labels?: Array<string>;

  @ApiProperty({
    description:
      'Whether this change has been merged into the target system state.',
  })
  merged: boolean;

  @ApiProperty({
    description:
      'Whether this change currently conflicts with another change or with the target system state.',
  })
  hasConflict: boolean;

  @ApiPropertyOptional({
    description: 'Any links related to this change.',
    type: [String],
  })
  links?: Array<string>;

  @ApiProperty({
    description: 'Timestamp when this change was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this change was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiPropertyOptional({
    description: 'Optional timestamp when this change was merged.',
    format: 'date-time',
  })
  mergedAt?: string;

  @ApiPropertyOptional({
    description:
      'Optional timestamp when this change was closed without being merged.',
    format: 'date-time',
  })
  closedAt?: string;

  [key: string]: unknown;
}

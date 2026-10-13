import { ApiPropertyOptional } from '@nestjs/swagger';
import { NestedChangeItemDto } from '../../change-item/dto/nested-change-item.dto.js';
import { NestedCommentDto } from '../../comment/dto/nested-comment.dto.js';
import { NestedDecisionDto } from '../../decision/dto/nested-decision.dto.js';
import { NestedMemberDto } from '../../member/dto/nested-member.dto.js';
import { NestedReviewCommentDto } from '../../review-comment/dto/nested-review-comment.dto.js';

export class NestedChangeDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "Change" for Change entities.',
    enum: ['Change'],
  })
  entityType?: 'Change';

  @ApiPropertyOptional({
    description: 'Id of the object this object is derived from.',
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  basedOn?: string;

  @ApiPropertyOptional({
    description: 'URL for documentation about this entity type.',
    format: 'uri',
  })
  entityDocumentationUrl?: string;

  @ApiPropertyOptional({
    description: 'URL for documentation about this object instance',
    format: 'uri',
  })
  documentationUrl?: string;

  @ApiPropertyOptional({
    description: 'Timestamp when this entity record was created.',
    format: 'date-time',
  })
  createdAt?: string;

  @ApiPropertyOptional({
    description: 'Label codes associated with this entity.',
    type: [String],
  })
  labelCodes?: Array<string>;

  @ApiPropertyOptional({
    description: 'Human-readable title summarizing the proposed change.',
  })
  title?: string;

  @ApiPropertyOptional({
    description:
      'Detailed explanation of what this change proposes and why it is needed.',
  })
  description?: string;

  @ApiPropertyOptional({
    description:
      'Short explanation of what this change proposes and why it is needed.',
  })
  summary?: string;

  @ApiPropertyOptional({
    description: 'explanation of why this change is being proposed.',
  })
  reason?: string;

  @ApiPropertyOptional({
    description:
      'ChangeItem entities describing each proposed object-level operation in this change.',
    type: () => [NestedChangeItemDto],
  })
  changes?: Array<NestedChangeItemDto>;

  @ApiPropertyOptional({
    description: 'Current decision about this change',
    type: () => NestedDecisionDto,
  })
  decision?: NestedDecisionDto;

  @ApiPropertyOptional({
    description:
      'Recent Comment entities for this change, such as the first page of comments.',
    type: () => [NestedCommentDto],
  })
  comments?: Array<NestedCommentDto>;

  @ApiPropertyOptional({
    description:
      'URL where the full comment thread for this change can be fetched or viewed.',
    format: 'uri',
  })
  commentsUrl?: string;

  @ApiPropertyOptional({
    description:
      'ReviewComment entities tied to changed objects, fields, records, or diff entries.',
    type: () => [NestedReviewCommentDto],
  })
  reviewComments?: Array<NestedReviewCommentDto>;

  @ApiPropertyOptional({
    description: 'Member entities that authored or co-authored this change.',
    type: () => [NestedMemberDto],
  })
  authors?: Array<NestedMemberDto>;

  @ApiPropertyOptional({
    description:
      'Identifier of the primary member responsible for this change.',
    pattern: '^Member/[^/\\s]+$',
  })
  mainAuthorId?: string;

  @ApiPropertyOptional({
    description: 'Primary member responsible for this change.',
    type: () => NestedMemberDto,
  })
  mainAuthor?: NestedMemberDto;

  @ApiPropertyOptional({
    description: 'Member entities requested or assigned to review this change.',
    type: () => [NestedMemberDto],
  })
  reviewers?: Array<NestedMemberDto>;

  @ApiPropertyOptional({
    description: 'Lifecycle status of the change.',
    enum: ['drafted', 'closed', 'open', 'rejected', 'approved', 'merged'],
  })
  status?: 'drafted' | 'closed' | 'open' | 'rejected' | 'approved' | 'merged';

  @ApiPropertyOptional({
    description:
      'URL showing a diff for all changed objects, similar to a GitHub pull request diff.',
    format: 'uri',
  })
  diffUrl?: string;

  @ApiPropertyOptional({
    description:
      'Human-friendly sequence number for this change inside the relevant system or scope.',
    minimum: 1,
  })
  number?: number;

  @ApiPropertyOptional({
    description: 'Label assigned to this change.',
    type: [String],
  })
  labels?: Array<string>;

  @ApiPropertyOptional({
    description:
      'Whether this change has been merged into the target system state.',
    default: false,
  })
  merged?: boolean;

  @ApiPropertyOptional({
    description:
      'Whether this change currently conflicts with another change or with the target system state.',
    default: false,
  })
  hasConflict?: boolean;

  @ApiPropertyOptional({
    description: 'Any links related to this change.',
    type: [String],
  })
  links?: Array<string>;

  @ApiPropertyOptional({
    description: 'Timestamp when this change was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

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

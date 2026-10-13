import { ApiPropertyOptional } from '@nestjs/swagger';
import { NestedMemberDto } from '../../member/dto/nested-member.dto.js';
import { NestedRuleDto } from '../../rule/dto/nested-rule.dto.js';
import { NestedVoteDto } from '../../vote/dto/nested-vote.dto.js';

export class NestedDecisionDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "Decision" for Decision entities.',
    enum: ['Decision'],
  })
  entityType?: 'Decision';

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
    description:
      'ID of the object, proposal, rule, resource, or question being decided.',
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  subject?: string;

  @ApiPropertyOptional({
    description: 'Current lifecycle state of the decision.',
    enum: ['open', 'closed', 'rejected', 'cancelled'],
  })
  state?: 'open' | 'closed' | 'rejected' | 'cancelled';

  @ApiPropertyOptional({
    description:
      'Id of previous revision of this decision, If this decision is a modified version of another decision.',
    pattern: '^Decision/[^/\\s]+$',
  })
  previousRevisionId?: string;

  @ApiPropertyOptional({
    description:
      'Current outcome of the decision, if the decision has produced an outcome at least once.',
    type: () => NestedDecisionDto,
  })
  previousRevision?: NestedDecisionDto;

  @ApiPropertyOptional({
    description: 'Member entities eligible to participate in this decision.',
    type: () => [NestedMemberDto],
  })
  eligibleMembers?: Array<NestedMemberDto>;

  @ApiPropertyOptional({
    description:
      'Member entities affected by this decision under the IFS scope rule.',
    type: () => [NestedMemberDto],
  })
  affectedMembers?: Array<NestedMemberDto>;

  @ApiPropertyOptional({
    description:
      'Vote entities cast directly by members or by delegates acting on their behalf.',
    type: () => [NestedVoteDto],
  })
  votes?: Array<NestedVoteDto>;

  @ApiPropertyOptional({
    description:
      'Rule entities that govern eligibility, delegation, quorum, thresholds, timing, or outcome calculation for this decision.',
    type: () => [NestedRuleDto],
  })
  rules?: Array<NestedRuleDto>;

  @ApiPropertyOptional({
    description: 'Snapshot count of members eligible to participate.',
    minimum: 0,
  })
  eligibleMemberCount?: number;

  @ApiPropertyOptional({
    description: 'Snapshot count of members affected by this decision.',
    minimum: 0,
  })
  affectedMemberCount?: number;

  @ApiPropertyOptional({
    description:
      'Snapshot count of votes currently recorded for this decision.',
    minimum: 0,
  })
  voteCount?: number;

  @ApiPropertyOptional({
    description:
      'Snapshot count of votes cast by delegates on behalf of eligible members.',
    minimum: 0,
  })
  delegateVoteCount?: number;

  @ApiPropertyOptional({
    description: 'Timestamp when this decision opened for participation.',
    format: 'date-time',
  })
  openedAt?: string;

  @ApiPropertyOptional({
    description: 'Optional timestamp when this decision closed.',
    format: 'date-time',
  })
  closedAt?: string;

  @ApiPropertyOptional({
    description: 'Optional timestamp when this decision was cancelled.',
    format: 'date-time',
  })
  cancelledAt?: string;

  @ApiPropertyOptional({
    description:
      'Optional timestamp when participation, vote data, or outcome was verified.',
    format: 'date-time',
  })
  verifiedAt?: string;

  @ApiPropertyOptional({
    description:
      'Optional timestamp when this decision produced an approved outcome.',
    format: 'date-time',
  })
  approvedAt?: string;

  @ApiPropertyOptional({
    description:
      'Optional timestamp when this decision was rejected or produced a rejected outcome.',
    format: 'date-time',
  })
  rejectedAt?: string;

  @ApiPropertyOptional({
    description: 'Timestamp when this decision record was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  @ApiPropertyOptional({
    description: 'Timestamp when this decision record was decided.',
    format: 'date-time',
  })
  decidedAt?: string;

  [key: string]: unknown;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberResponseDto } from '../../member/dto/member-response.dto.js';
import { RuleResponseDto } from '../../rule/dto/rule-response.dto.js';
import { VoteResponseDto } from '../../vote/dto/vote-response.dto.js';

export class DecisionResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this decision.',
    pattern: '^Decision/[^/\\s]+$',
    allOf: [
      {
        type: 'string',
        description: 'Globally unique entity identifier in EntityType/ID form.',
        pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
      },
      {
        type: 'string',
        description: 'Globally unique identifier for this decision.',
        pattern: '^Decision/[^/\\s]+$',
      },
    ],
  })
  id: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Decision" for Decision entities.',
    enum: ['Decision'],
  })
  entityType: 'Decision';

  @ApiPropertyOptional({
    description: 'Id of the object this object is derived from.',
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  basedOn?: string;

  @ApiProperty({
    description: 'URL for documentation about this entity.',
    format: 'uri',
  })
  entityDocumentationUrl: string;

  @ApiProperty({
    description: 'Timestamp when this entity record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description:
      'ID of the object, proposal, rule, resource, or question being decided.',
    pattern: '^[A-Z][A-Za-z0-9]*/[^/\\s]+$',
  })
  subject: string;

  @ApiProperty({
    description: 'Current lifecycle state of the decision.',
    enum: ['open', 'closed', 'rejected', 'cancelled'],
  })
  state: 'open' | 'closed' | 'rejected' | 'cancelled';

  @ApiPropertyOptional({
    description:
      'Id of previous revision of this decision, If this decision is a modified version of another decision.',
    pattern: '^Decision/[^/\\s]+$',
  })
  previousRevisionId?: string;

  @ApiPropertyOptional({
    description:
      'Current outcome of the decision, if the decision has produced an outcome at least once.',
    type: () => DecisionResponseDto,
  })
  previousRevision?: DecisionResponseDto;

  @ApiProperty({
    description: 'Member entities eligible to participate in this decision.',
    type: () => [MemberResponseDto],
  })
  eligibleMembers: Array<MemberResponseDto>;

  @ApiProperty({
    description:
      'Member entities affected by this decision under the IFS scope rule.',
    type: () => [MemberResponseDto],
  })
  affectedMembers: Array<MemberResponseDto>;

  @ApiProperty({
    description:
      'Vote entities cast directly by members or by delegates acting on their behalf.',
    type: () => [VoteResponseDto],
  })
  votes: Array<VoteResponseDto>;

  @ApiPropertyOptional({
    description:
      'Rule entities that govern eligibility, delegation, quorum, thresholds, timing, or outcome calculation for this decision.',
    type: () => [RuleResponseDto],
  })
  rules?: Array<RuleResponseDto>;

  @ApiProperty({
    description: 'Snapshot count of members eligible to participate.',
    minimum: 0,
  })
  eligibleMemberCount: number;

  @ApiProperty({
    description: 'Snapshot count of members affected by this decision.',
    minimum: 0,
  })
  affectedMemberCount: number;

  @ApiProperty({
    description:
      'Snapshot count of votes currently recorded for this decision.',
    minimum: 0,
  })
  voteCount: number;

  @ApiPropertyOptional({
    description:
      'Snapshot count of votes cast by delegates on behalf of eligible members.',
    minimum: 0,
  })
  delegateVoteCount?: number;

  @ApiProperty({
    description: 'Timestamp when this decision opened for participation.',
    format: 'date-time',
  })
  openedAt: string;

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

  @ApiProperty({
    description: 'Timestamp when this decision record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiPropertyOptional({
    description: 'Timestamp when this decision record was decided.',
    format: 'date-time',
  })
  decidedAt?: string;

  [key: string]: unknown;
}

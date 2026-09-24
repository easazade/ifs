import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScopeResponseDto {
  @ApiProperty({
    description: 'Globally unique identifier for this scope.',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this Scope.' })
  ifsId: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "Scope" for Scope entities.',
    enum: ['Scope'],
  })
  entityType: 'Scope';

  @ApiPropertyOptional({
    description: 'Id of the object this object is derived from.',
  })
  basedOn?: string;

  @ApiProperty({
    description: 'URL for documentation about this entity.',
    format: 'uri',
  })
  entityDocumentationUrl: string;

  @ApiProperty({ description: 'Human-readable name of the scope.' })
  name: string;

  @ApiPropertyOptional({
    description:
      'Optional human-readable explanation of what this scope includes and excludes.',
  })
  description?: string;

  @ApiPropertyOptional({
    description:
      'Location identifiers or names included in this scope. Kept as strings for now.',
    type: [String],
  })
  locations?: Array<string>;

  @ApiPropertyOptional({
    description:
      'Group identifiers or names included in this scope. Kept as strings for now.',
    type: [String],
  })
  groups?: Array<string>;

  @ApiPropertyOptional({
    description:
      'Object identifiers or names included in this scope. Kept as strings for now.',
    type: [String],
  })
  objects?: Array<string>;

  @ApiPropertyOptional({
    description:
      'Entity identifiers or names included in this scope. Kept as strings for now.',
    type: [String],
  })
  entities?: Array<string>;

  @ApiPropertyOptional({
    description:
      'Identifier of a broader parent scope, when this scope is nested inside another scope.',
  })
  parentScopeId?: string;

  @ApiPropertyOptional({
    description:
      'Identifiers of narrower child scopes contained by this scope.',
    type: [String],
  })
  childScopeIds?: Array<string>;

  @ApiPropertyOptional({
    description:
      'Embedded scope-local rules for inclusion, exclusion, inheritance, or conflict resolution. This is not a referenced entity because boundary logic may be implementation-specific.',
    type: 'object',
    additionalProperties: true,
  })
  boundaryRules?: Record<string, unknown>;

  @ApiProperty({
    description: 'Timestamp when this scope record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this scope record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  [key: string]: unknown;
}

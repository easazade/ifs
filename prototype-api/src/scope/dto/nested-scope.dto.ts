import { ApiPropertyOptional } from '@nestjs/swagger';

export class NestedScopeDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "Scope" for Scope entities.',
    enum: ['Scope'],
  })
  entityType?: 'Scope';

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

  @ApiPropertyOptional({ description: 'Human-readable name of the scope.' })
  name?: string;

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
    pattern: '^Scope/[^/\\s]+$',
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

  @ApiPropertyOptional({
    description: 'Timestamp when this scope record was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  [key: string]: unknown;
}

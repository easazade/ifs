import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActionDto {
  @ApiProperty({ description: 'Globally unique identifier for this action.' })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this Action.' })
  ifsId: string;

  @ApiProperty({
    description: 'Entity category for this object, normally Action.',
  })
  entityType: string;

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
    description: 'Timestamp when this action record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this action record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiProperty({ description: 'Human-readable name of the action.' })
  name: string;

  @ApiProperty({
    description:
      'Stable unique name used by IFS implementations to identify this action.',
  })
  uniqueName: string;

  @ApiProperty({
    description:
      'Whether a member or role must hold an applicable permission before performing this action.',
  })
  requiresPermission: boolean;

  @ApiProperty({ description: 'Describes the action.' })
  description: string;

  @ApiPropertyOptional({
    description: 'Instructions for how to perform the action.',
  })
  instructions?: string;

  @ApiPropertyOptional({ description: 'Additional notes about this action.' })
  notes?: string;

  @ApiPropertyOptional({
    description:
      'Warnings, risks, or constraints to review before performing this action.',
  })
  warnings?: string;

  @ApiProperty({
    description: 'Lifecycle state of the action.',
    enum: [
      'drafted',
      'under-review',
      'active',
      'suspended',
      'revoked',
      'deprecated',
    ],
  })
  state:
    | 'drafted'
    | 'under-review'
    | 'active'
    | 'suspended'
    | 'revoked'
    | 'deprecated';
}

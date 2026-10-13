import { ApiPropertyOptional } from '@nestjs/swagger';
import { NestedMemberDto } from '../../member/dto/nested-member.dto.js';

export class NestedObservationDto {
  @ApiPropertyOptional({
    description:
      'Existing entity ID, or omit/use null or an empty string to create a new entity. An ID-only object links an existing entity; other supplied fields are merged or created.',
    nullable: true,
  })
  id?: string | null;

  @ApiPropertyOptional({
    description:
      'Entity type discriminator. Always "Observation" for Observation entities.',
    enum: ['Observation'],
  })
  entityType?: 'Observation';

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
    description: 'Timestamp when this observation record was last updated.',
    format: 'date-time',
  })
  updatedAt?: string;

  @ApiPropertyOptional({ description: 'Description of what was observed.' })
  description?: string;

  @ApiPropertyOptional({
    description:
      'Location identifiers or names where the observation occurred.',
    type: [String],
  })
  locations?: Array<string>;

  @ApiPropertyOptional({
    description: 'Date and time when the observation occurred.',
    format: 'date-time',
  })
  timeOfObservation?: string;

  @ApiPropertyOptional({
    description: 'Member who made the report about what they observed.',
    type: () => NestedMemberDto,
  })
  observer?: NestedMemberDto;

  [key: string]: unknown;
}

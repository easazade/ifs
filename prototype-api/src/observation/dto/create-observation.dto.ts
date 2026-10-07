import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberResponseDto } from '../../member/dto/member-response.dto.js';

export class CreateObservationDto {
  @ApiProperty({
    description: 'Globally unique identifier for this observation.',
    pattern: '^Observation/[^/\\s]+$',
  })
  id: string;

  @ApiProperty({
    description: 'Entity category for this object, normally Observation.',
  })
  entityType: string;

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
    description: 'Timestamp when this observation record was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this observation record was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiProperty({ description: 'Description of what was observed.' })
  description: string;

  @ApiProperty({
    description:
      'Location identifiers or names where the observation occurred.',
    type: [String],
  })
  locations: Array<string>;

  @ApiProperty({
    description: 'Date and time when the observation occurred.',
    format: 'date-time',
  })
  timeOfObservation: string;

  @ApiProperty({
    description: 'Member who made the report about what they observed.',
    type: () => MemberResponseDto,
  })
  observer: MemberResponseDto;
}

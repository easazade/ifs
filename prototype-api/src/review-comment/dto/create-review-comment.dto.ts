import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewCommentDto {
  @ApiProperty({
    description: 'Globally unique identifier for this review comment.',
  })
  id: string;

  @ApiProperty({ description: 'IFS system identifier for this ReviewComment.' })
  ifsId: string;

  @ApiProperty({
    description:
      'Entity type discriminator. Always "ReviewComment" for ReviewComment entities.',
    enum: ['ReviewComment'],
  })
  entityType: 'ReviewComment';

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
    description: 'Timestamp when this review comment was created.',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when this review comment was last updated.',
    format: 'date-time',
  })
  updatedAt: string;

  [key: string]: unknown;
}

// GENERATED FOR SCENARIO TESTING PURPOSES. DO NOT MODIFY BY HAND

export interface ReviewComment {
  /**
   * Globally unique identifier for this review comment.
   */
  id: string;
  /**
   * IFS system identifier for this ReviewComment.
   */
  ifsId: string;
  /**
   * Entity type discriminator. Always "ReviewComment" for ReviewComment entities.
   */
  entityType: "ReviewComment";
  /**
   * Id of the object this object is derived from.
   */
  basedOn?: string;
  /**
   * URL for documentation about this entity.
   */
  entityDocumentationUrl: string;
  /**
   * Timestamp when this review comment was created.
   */
  createdAt: string;
  /**
   * Timestamp when this review comment was last updated.
   */
  updatedAt: string;
  [k: string]: unknown;
}

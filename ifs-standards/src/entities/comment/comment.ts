// GENERATED FOR SCENARIO TESTING PURPOSES. DO NOT MODIFY BY HAND

export interface Comment {
  /**
   * Globally unique identifier for this comment.
   */
  id: string;
  /**
   * IFS system identifier for this Comment.
   */
  ifsId: string;
  /**
   * Entity type discriminator. Always "Comment" for Comment entities.
   */
  entityType: "Comment";
  /**
   * Id of the object this object is derived from.
   */
  basedOn?: string;
  /**
   * URL for documentation about this entity.
   */
  entityDocumentationUrl: string;
  /**
   * Timestamp when this comment was created.
   */
  createdAt: string;
  /**
   * Timestamp when this comment was last updated.
   */
  updatedAt: string;
  [k: string]: unknown;
}

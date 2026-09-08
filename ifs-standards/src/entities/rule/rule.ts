// GENERATED FOR SCENARIO TESTING PURPOSES. DO NOT MODIFY BY HAND

export interface Rule {
  /**
   * Globally unique identifier for this rule.
   */
  id: string;
  /**
   * IFS system identifier for this Rule.
   */
  ifsId: string;
  /**
   * Entity category for this object, normally Rule.
   */
  entityType: string;
  /**
   * Id of the object this object is derived from.
   */
  basedOn?: string;
  /**
   * URL for documentation about this entity.
   */
  entityDocumentationUrl: string;
  /**
   * Timestamp when this rule record was created.
   */
  createdAt: string;
  /**
   * Timestamp when this rule record was last updated.
   */
  updatedAt: string;
  [k: string]: unknown;
}

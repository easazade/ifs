// GENERATED FOR SCENARIO TESTING PURPOSES. DO NOT MODIFY BY HAND

export interface Vote {
  /**
   * Globally unique identifier for this vote.
   */
  id: string;
  /**
   * IFS system identifier for this Vote.
   */
  ifsId: string;
  /**
   * Entity category for this object, normally Vote.
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
   * Timestamp when this vote record was created.
   */
  createdAt: string;
  /**
   * Timestamp when this vote record was last updated.
   */
  updatedAt: string;
  /**
   * Identifier of the decision this vote participates in.
   */
  decisionId: string;
  /**
   * Identifier of the member who cast or owns this vote.
   */
  memberId: string;
  /**
   * Vote value recorded for the decision, such as an implementation-defined choice or consent signal.
   */
  value: string;
  /**
   * Identifier of the previous revision of this vote, if this vote amends an earlier vote.
   */
  previousRevisionId?: string;
  [k: string]: unknown;
}

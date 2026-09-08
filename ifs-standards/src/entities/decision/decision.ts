// GENERATED FOR SCENARIO TESTING PURPOSES. DO NOT MODIFY BY HAND

/**
 * Scope entity describing where this role applies.
 */
export type Scope = {
  [k: string]: unknown;
} & {
  /**
   * Globally unique identifier for this scope.
   */
  id: string;
  /**
   * IFS system identifier for this Scope.
   */
  ifsId: string;
  /**
   * Entity type discriminator. Always "Scope" for Scope entities.
   */
  entityType: "Scope";
  /**
   * Id of the object this object is derived from.
   */
  basedOn?: string;
  /**
   * URL for documentation about this entity.
   */
  entityDocumentationUrl: string;
  /**
   * Human-readable name of the scope.
   */
  name: string;
  /**
   * Optional human-readable explanation of what this scope includes and excludes.
   */
  description?: string;
  /**
   * Location identifiers or names included in this scope. Kept as strings for now.
   */
  locations?: string[];
  /**
   * Group identifiers or names included in this scope. Kept as strings for now.
   */
  groups?: string[];
  /**
   * Object identifiers or names included in this scope. Kept as strings for now.
   */
  objects?: string[];
  /**
   * Entity identifiers or names included in this scope. Kept as strings for now.
   */
  entities?: string[];
  /**
   * Identifier of a broader parent scope, when this scope is nested inside another scope.
   */
  parentScopeId?: string;
  /**
   * Identifiers of narrower child scopes contained by this scope.
   */
  childScopeIds?: string[];
  /**
   * Embedded scope-local rules for inclusion, exclusion, inheritance, or conflict resolution. This is not a referenced entity because boundary logic may be implementation-specific.
   */
  boundaryRules?: {
    [k: string]: unknown;
  };
  /**
   * Timestamp when this scope record was created.
   */
  createdAt: string;
  /**
   * Timestamp when this scope record was last updated.
   */
  updatedAt: string;
  [k: string]: unknown;
};

export interface Decision {
  /**
   * Globally unique identifier for this decision.
   */
  id: string;
  /**
   * IFS system identifier for this Decision.
   */
  ifsId: string;
  /**
   * Entity category for this object, normally Decision.
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
   * Stable IFS reference to the object, proposal, rule, resource, or question being decided. Kept as a reference string because a decision subject can point to heterogeneous resources.
   */
  subject: string;
  /**
   * Current lifecycle state of the decision.
   */
  state: "open" | "closed" | "rejected" | "cancelled";
  /**
   * Id of previous revision of this decision, If this decision is a modified version of another decision.
   */
  previousRevisionId?: string;
  previousRevision?: Decision1;
  /**
   * Member entities eligible to participate in this decision.
   */
  eligibleMembers: Member[];
  /**
   * Member entities affected by this decision under the IFS scope rule.
   */
  affectedMembers: Member[];
  /**
   * Vote entities cast directly by members or by delegates acting on their behalf.
   */
  votes: Vote[];
  /**
   * Rule entities that govern eligibility, delegation, quorum, thresholds, timing, or outcome calculation for this decision.
   */
  rules?: Rule[];
  /**
   * Snapshot count of members eligible to participate.
   */
  eligibleMemberCount: number;
  /**
   * Snapshot count of members affected by this decision.
   */
  affectedMemberCount: number;
  /**
   * Snapshot count of votes currently recorded for this decision.
   */
  voteCount: number;
  /**
   * Snapshot count of votes cast by delegates on behalf of eligible members.
   */
  delegateVoteCount?: number;
  /**
   * Timestamp when this decision opened for participation.
   */
  openedAt: string;
  /**
   * Optional timestamp when this decision closed.
   */
  closedAt?: string;
  /**
   * Optional timestamp when this decision was cancelled.
   */
  cancelledAt?: string;
  /**
   * Optional timestamp when participation, vote data, or outcome was verified.
   */
  verifiedAt?: string;
  /**
   * Optional timestamp when this decision produced an approved outcome.
   */
  approvedAt?: string;
  /**
   * Optional timestamp when this decision was rejected or produced a rejected outcome.
   */
  rejectedAt?: string;
  /**
   * Timestamp when this decision record was created.
   */
  createdAt: string;
  /**
   * Timestamp when this decision record was last updated.
   */
  updatedAt: string;
  /**
   * Timestamp when this decision record was decided.
   */
  decidedAt?: string;
  [k: string]: unknown;
}
/**
 * Current outcome of the decision, if the decision has produced an outcome at least once.
 */
export interface Decision1 {
  /**
   * Globally unique identifier for this decision.
   */
  id: string;
  /**
   * IFS system identifier for this Decision.
   */
  ifsId: string;
  /**
   * Entity category for this object, normally Decision.
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
   * Stable IFS reference to the object, proposal, rule, resource, or question being decided. Kept as a reference string because a decision subject can point to heterogeneous resources.
   */
  subject: string;
  /**
   * Current lifecycle state of the decision.
   */
  state: "open" | "closed" | "rejected" | "cancelled";
  /**
   * Id of previous revision of this decision, If this decision is a modified version of another decision.
   */
  previousRevisionId?: string;
  previousRevision?: Decision2;
  /**
   * Member entities eligible to participate in this decision.
   */
  eligibleMembers: Member[];
  /**
   * Member entities affected by this decision under the IFS scope rule.
   */
  affectedMembers: Member[];
  /**
   * Vote entities cast directly by members or by delegates acting on their behalf.
   */
  votes: Vote[];
  /**
   * Rule entities that govern eligibility, delegation, quorum, thresholds, timing, or outcome calculation for this decision.
   */
  rules?: Rule[];
  /**
   * Snapshot count of members eligible to participate.
   */
  eligibleMemberCount: number;
  /**
   * Snapshot count of members affected by this decision.
   */
  affectedMemberCount: number;
  /**
   * Snapshot count of votes currently recorded for this decision.
   */
  voteCount: number;
  /**
   * Snapshot count of votes cast by delegates on behalf of eligible members.
   */
  delegateVoteCount?: number;
  /**
   * Timestamp when this decision opened for participation.
   */
  openedAt: string;
  /**
   * Optional timestamp when this decision closed.
   */
  closedAt?: string;
  /**
   * Optional timestamp when this decision was cancelled.
   */
  cancelledAt?: string;
  /**
   * Optional timestamp when participation, vote data, or outcome was verified.
   */
  verifiedAt?: string;
  /**
   * Optional timestamp when this decision produced an approved outcome.
   */
  approvedAt?: string;
  /**
   * Optional timestamp when this decision was rejected or produced a rejected outcome.
   */
  rejectedAt?: string;
  /**
   * Timestamp when this decision record was created.
   */
  createdAt: string;
  /**
   * Timestamp when this decision record was last updated.
   */
  updatedAt: string;
  /**
   * Timestamp when this decision record was decided.
   */
  decidedAt?: string;
  [k: string]: unknown;
}
/**
 * Current outcome of the decision, if the decision has produced an outcome at least once.
 */
export interface Decision2 {
  /**
   * Globally unique identifier for this decision.
   */
  id: string;
  /**
   * IFS system identifier for this Decision.
   */
  ifsId: string;
  /**
   * Entity category for this object, normally Decision.
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
   * Stable IFS reference to the object, proposal, rule, resource, or question being decided. Kept as a reference string because a decision subject can point to heterogeneous resources.
   */
  subject: string;
  /**
   * Current lifecycle state of the decision.
   */
  state: "open" | "closed" | "rejected" | "cancelled";
  /**
   * Id of previous revision of this decision, If this decision is a modified version of another decision.
   */
  previousRevisionId?: string;
  previousRevision?: Decision2;
  /**
   * Member entities eligible to participate in this decision.
   */
  eligibleMembers: Member[];
  /**
   * Member entities affected by this decision under the IFS scope rule.
   */
  affectedMembers: Member[];
  /**
   * Vote entities cast directly by members or by delegates acting on their behalf.
   */
  votes: Vote[];
  /**
   * Rule entities that govern eligibility, delegation, quorum, thresholds, timing, or outcome calculation for this decision.
   */
  rules?: Rule[];
  /**
   * Snapshot count of members eligible to participate.
   */
  eligibleMemberCount: number;
  /**
   * Snapshot count of members affected by this decision.
   */
  affectedMemberCount: number;
  /**
   * Snapshot count of votes currently recorded for this decision.
   */
  voteCount: number;
  /**
   * Snapshot count of votes cast by delegates on behalf of eligible members.
   */
  delegateVoteCount?: number;
  /**
   * Timestamp when this decision opened for participation.
   */
  openedAt: string;
  /**
   * Optional timestamp when this decision closed.
   */
  closedAt?: string;
  /**
   * Optional timestamp when this decision was cancelled.
   */
  cancelledAt?: string;
  /**
   * Optional timestamp when participation, vote data, or outcome was verified.
   */
  verifiedAt?: string;
  /**
   * Optional timestamp when this decision produced an approved outcome.
   */
  approvedAt?: string;
  /**
   * Optional timestamp when this decision was rejected or produced a rejected outcome.
   */
  rejectedAt?: string;
  /**
   * Timestamp when this decision record was created.
   */
  createdAt: string;
  /**
   * Timestamp when this decision record was last updated.
   */
  updatedAt: string;
  /**
   * Timestamp when this decision record was decided.
   */
  decidedAt?: string;
  [k: string]: unknown;
}
export interface Member {
  /**
   * Globally unique identifier for this member.
   */
  id: string;
  /**
   * IFS system identifier for this Member.
   */
  ifsId: string;
  /**
   * Entity type discriminator. Always "Member" for Member entities.
   */
  entityType: "Member";
  /**
   * URL for documentation about this entity.
   */
  entityDocumentationUrl: string;
  /**
   * Human-readable name of the member.
   */
  name: string;
  roles: Role[];
  permissions: Permission[];
  /**
   * Whether this member is considered an owner of the system.
   */
  isOwner: boolean;
  /**
   * Timestamp when this member record was created.
   */
  createdAt: string;
  /**
   * Timestamp when this member record was last updated.
   */
  updatedAt: string;
  [k: string]: unknown;
}
export interface Role {
  /**
   * Globally unique identifier for this role.
   */
  id: string;
  /**
   * IFS system identifier for this Role.
   */
  ifsId: string;
  /**
   * Entity type discriminator. Always "Role" for Role entities.
   */
  entityType: "Role";
  /**
   * Id of the object this object is derived from.
   */
  basedOn?: string;
  /**
   * URL for documentation about this entity.
   */
  entityDocumentationUrl: string;
  /**
   * Human-readable name of the role.
   */
  name: string;
  /**
   * Optional human-readable explanation of what this role is for.
   */
  description?: string;
  /**
   * Identifier of the member acting through this role.
   */
  memberId: string;
  /**
   * Identifier of the scope where this role has authority.
   */
  scopeId: string;
  scope: Scope;
  /**
   * Permission entities bundled into this role.
   */
  permissions: Permission[];
  /**
   * Lifecycle state of the role.
   */
  state: "drafted" | "under-review" | "active" | "suspended" | "revoked" | "expired";
  /**
   * Timestamp when this role record was created.
   */
  createdAt: string;
  /**
   * Timestamp when this role record was last updated.
   */
  updatedAt: string;
  /**
   * Optional timestamp after which this role no longer applies.
   */
  expiresAt?: string;
  [k: string]: unknown;
}
export interface Permission {
  /**
   * Globally unique identifier for this permission.
   */
  id: string;
  /**
   * IFS system identifier for this Permission.
   */
  ifsId: string;
  /**
   * Entity type discriminator. Always "Permission" for Permission entities.
   */
  entityType: "Permission";
  /**
   * Id of the object this object is derived from.
   */
  basedOn?: string;
  /**
   * URL for documentation about this entity.
   */
  entityDocumentationUrl: string;
  /**
   * ID list of actions that this permission allows
   */
  actionIds: string[];
  /**
   * List of actions that this permission allows
   */
  actions?: Action[];
  /**
   * Identifier of the member receiving this permission.
   */
  memberId?: string;
  /**
   * Identifier of the role receiving this permission.
   */
  roleId?: string;
  /**
   * Identifier of the scope object where this permission applies.
   */
  scopeId: string;
  /**
   * Scope object describing the system, project, process, area, or other bounded context where this permission applies.
   */
  scope?: {
    [k: string]: unknown;
  };
  /**
   * Lifecycle state of the permission. Example values may include drafted, under-review, active, suspended, or revoked.
   */
  state: "granted" | "under-review" | "revoked" | "drafted";
  /**
   * Timestamp when this permission record was created.
   */
  createdAt: string;
  /**
   * Timestamp when this permission record was last updated.
   */
  updatedAt?: string;
  /**
   * Optional timestamp after which this permission no longer applies.
   */
  expiresAt: string;
  [k: string]: unknown;
}
export interface Action {
  /**
   * Globally unique identifier for this action.
   */
  id: string;
  /**
   * IFS system identifier for this Action.
   */
  ifsId: string;
  /**
   * Entity category for this object, normally Action.
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
   * Timestamp when this action record was created.
   */
  createdAt: string;
  /**
   * Timestamp when this action record was last updated.
   */
  updatedAt: string;
  /**
   * Human-readable name of the action.
   */
  name: string;
  /**
   * Stable unique name used by IFS implementations to identify this action.
   */
  uniqueName: string;
  /**
   * Whether a member or role must hold an applicable permission before performing this action.
   */
  requiresPermission: boolean;
  /**
   * Describes the action.
   */
  description: string;
  /**
   * Instructions for how to perform the action.
   */
  instructions?: string;
  /**
   * Additional notes about this action.
   */
  notes?: string;
  /**
   * Warnings, risks, or constraints to review before performing this action.
   */
  warnings?: string;
  /**
   * Lifecycle state of the action.
   */
  state: "drafted" | "under-review" | "active" | "suspended" | "revoked" | "deprecated";
}
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

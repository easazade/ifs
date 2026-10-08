import {
  getHello,
  setApiBaseUrl,
  createAction,
  deleteAction,
  getAction,
  listActions,
  updateAction,
  type CreateActionDto,
  type UpdateActionDto,
  type ActionResponseDto,
  createChange,
  deleteChange,
  getChange,
  listChanges,
  updateChange,
  type CreateChangeDto,
  type UpdateChangeDto,
  type ChangeResponseDto,
  createChangeItem,
  deleteChangeItem,
  getChangeItem,
  listChangeItems,
  updateChangeItem,
  type CreateChangeItemDto,
  type UpdateChangeItemDto,
  type ChangeItemResponseDto,
  createComment,
  deleteComment,
  getComment,
  listComments,
  updateComment,
  type CreateCommentDto,
  type UpdateCommentDto,
  type CommentResponseDto,
  createDecision,
  deleteDecision,
  getDecision,
  listDecisions,
  updateDecision,
  type CreateDecisionDto,
  type UpdateDecisionDto,
  type DecisionResponseDto,
  createDelegation,
  deleteDelegation,
  getDelegation,
  listDelegations,
  updateDelegation,
  type CreateDelegationDto,
  type UpdateDelegationDto,
  type DelegationResponseDto,
  createGeographicArea,
  deleteGeographicArea,
  getGeographicArea,
  listGeographicAreas,
  updateGeographicArea,
  type CreateGeographicAreaDto,
  type UpdateGeographicAreaDto,
  type GeographicAreaResponseDto,
  createGroup,
  deleteGroup,
  getGroup,
  listGroups,
  updateGroup,
  type CreateGroupDto,
  type UpdateGroupDto,
  type GroupResponseDto,
  createLabel,
  deleteLabel,
  getLabel,
  listLabels,
  updateLabel,
  type CreateLabelDto,
  type UpdateLabelDto,
  type LabelResponseDto,
  createMember,
  deleteMember,
  getMember,
  listMembers,
  updateMember,
  type CreateMemberDto,
  type UpdateMemberDto,
  type MemberResponseDto,
  createObservation,
  deleteObservation,
  getObservation,
  listObservations,
  updateObservation,
  type CreateObservationDto,
  type UpdateObservationDto,
  type ObservationResponseDto,
  createOrganization,
  deleteOrganization,
  getOrganization,
  listOrganizations,
  updateOrganization,
  type CreateOrganizationDto,
  type UpdateOrganizationDto,
  type OrganizationResponseDto,
  createPermission,
  deletePermission,
  getPermission,
  listPermissions,
  updatePermission,
  type CreatePermissionDto,
  type UpdatePermissionDto,
  type PermissionResponseDto,
  createPlace,
  deletePlace,
  getPlace,
  listPlaces,
  updatePlace,
  type CreatePlaceDto,
  type UpdatePlaceDto,
  type PlaceResponseDto,
  createProtocol,
  deleteProtocol,
  getProtocol,
  listProtocols,
  updateProtocol,
  type CreateProtocolDto,
  type UpdateProtocolDto,
  type ProtocolResponseDto,
  createRelationship,
  deleteRelationship,
  getRelationship,
  listRelationships,
  updateRelationship,
  type CreateRelationshipDto,
  type UpdateRelationshipDto,
  type RelationshipResponseDto,
  createRelationshipType,
  deleteRelationshipType,
  getRelationshipType,
  listRelationshipTypes,
  updateRelationshipType,
  type CreateRelationshipTypeDto,
  type UpdateRelationshipTypeDto,
  type RelationshipTypeResponseDto,
  createReviewComment,
  deleteReviewComment,
  getReviewComment,
  listReviewComments,
  updateReviewComment,
  type CreateReviewCommentDto,
  type UpdateReviewCommentDto,
  type ReviewCommentResponseDto,
  createRole,
  deleteRole,
  getRole,
  listRoles,
  updateRole,
  type CreateRoleDto,
  type UpdateRoleDto,
  type RoleResponseDto,
  createRule,
  deleteRule,
  getRule,
  listRules,
  updateRule,
  type CreateRuleDto,
  type UpdateRuleDto,
  type RuleResponseDto,
  createScope,
  deleteScope,
  getScope,
  listScopes,
  updateScope,
  type CreateScopeDto,
  type UpdateScopeDto,
  type ScopeResponseDto,
  createVote,
  deleteVote,
  getVote,
  listVotes,
  updateVote,
  type CreateVoteDto,
  type UpdateVoteDto,
  type VoteResponseDto,
} from "prototype-client";

export class Api {
  setApiBaseUrl(url: string): void {
    setApiBaseUrl(url);
  }

  async hello(): Promise<boolean> {
    try {
      await getHello();
      return true;
    } catch {
      return false;
    }
  }

  async createAction(input: CreateActionDto): Promise<ActionResponseDto | void> {
    const response = await createAction(input);
    return response.data;
  }

  async listActions(): Promise<ActionResponseDto[]> {
    const response = await listActions();
    return response.data;
  }

  async getAction(id: string): Promise<ActionResponseDto | void> {
    const response = await getAction(id);
    return response.data;
  }

  async updateAction(id: string, input: UpdateActionDto): Promise<ActionResponseDto | void> {
    const response = await updateAction(id, input);
    return response.data;
  }

  async deleteAction(id: string): Promise<void> {
    await deleteAction(id);
  }

  async createChange(input: CreateChangeDto): Promise<ChangeResponseDto | void> {
    const response = await createChange(input);
    return response.data;
  }

  async listChanges(): Promise<ChangeResponseDto[]> {
    const response = await listChanges();
    return response.data;
  }

  async getChange(id: string): Promise<ChangeResponseDto | void> {
    const response = await getChange(id);
    return response.data;
  }

  async updateChange(id: string, input: UpdateChangeDto): Promise<ChangeResponseDto | void> {
    const response = await updateChange(id, input);
    return response.data;
  }

  async deleteChange(id: string): Promise<void> {
    await deleteChange(id);
  }

  async createChangeItem(input: CreateChangeItemDto): Promise<ChangeItemResponseDto | void> {
    const response = await createChangeItem(input);
    return response.data;
  }

  async listChangeItems(): Promise<ChangeItemResponseDto[]> {
    const response = await listChangeItems();
    return response.data;
  }

  async getChangeItem(id: string): Promise<ChangeItemResponseDto | void> {
    const response = await getChangeItem(id);
    return response.data;
  }

  async updateChangeItem(id: string, input: UpdateChangeItemDto): Promise<ChangeItemResponseDto | void> {
    const response = await updateChangeItem(id, input);
    return response.data;
  }

  async deleteChangeItem(id: string): Promise<void> {
    await deleteChangeItem(id);
  }

  async createComment(input: CreateCommentDto): Promise<CommentResponseDto | void> {
    const response = await createComment(input);
    return response.data;
  }

  async listComments(): Promise<CommentResponseDto[]> {
    const response = await listComments();
    return response.data;
  }

  async getComment(id: string): Promise<CommentResponseDto | void> {
    const response = await getComment(id);
    return response.data;
  }

  async updateComment(id: string, input: UpdateCommentDto): Promise<CommentResponseDto | void> {
    const response = await updateComment(id, input);
    return response.data;
  }

  async deleteComment(id: string): Promise<void> {
    await deleteComment(id);
  }

  async createDecision(input: CreateDecisionDto): Promise<DecisionResponseDto | void> {
    const response = await createDecision(input);
    return response.data;
  }

  async listDecisions(): Promise<DecisionResponseDto[]> {
    const response = await listDecisions();
    return response.data;
  }

  async getDecision(id: string): Promise<DecisionResponseDto | void> {
    const response = await getDecision(id);
    return response.data;
  }

  async updateDecision(id: string, input: UpdateDecisionDto): Promise<DecisionResponseDto | void> {
    const response = await updateDecision(id, input);
    return response.data;
  }

  async deleteDecision(id: string): Promise<void> {
    await deleteDecision(id);
  }

  async createDelegation(input: CreateDelegationDto): Promise<DelegationResponseDto | void> {
    const response = await createDelegation(input);
    return response.data;
  }

  async listDelegations(): Promise<DelegationResponseDto[]> {
    const response = await listDelegations();
    return response.data;
  }

  async getDelegation(id: string): Promise<DelegationResponseDto | void> {
    const response = await getDelegation(id);
    return response.data;
  }

  async updateDelegation(id: string, input: UpdateDelegationDto): Promise<DelegationResponseDto | void> {
    const response = await updateDelegation(id, input);
    return response.data;
  }

  async deleteDelegation(id: string): Promise<void> {
    await deleteDelegation(id);
  }

  async createGeographicArea(input: CreateGeographicAreaDto): Promise<GeographicAreaResponseDto | void> {
    const response = await createGeographicArea(input);
    return response.data;
  }

  async listGeographicAreas(): Promise<GeographicAreaResponseDto[]> {
    const response = await listGeographicAreas();
    return response.data;
  }

  async getGeographicArea(id: string): Promise<GeographicAreaResponseDto | void> {
    const response = await getGeographicArea(id);
    return response.data;
  }

  async updateGeographicArea(id: string, input: UpdateGeographicAreaDto): Promise<GeographicAreaResponseDto | void> {
    const response = await updateGeographicArea(id, input);
    return response.data;
  }

  async deleteGeographicArea(id: string): Promise<void> {
    await deleteGeographicArea(id);
  }

  async createGroup(input: CreateGroupDto): Promise<GroupResponseDto | void> {
    const response = await createGroup(input);
    return response.data;
  }

  async listGroups(): Promise<GroupResponseDto[]> {
    const response = await listGroups();
    return response.data;
  }

  async getGroup(id: string): Promise<GroupResponseDto | void> {
    const response = await getGroup(id);
    return response.data;
  }

  async updateGroup(id: string, input: UpdateGroupDto): Promise<GroupResponseDto | void> {
    const response = await updateGroup(id, input);
    return response.data;
  }

  async deleteGroup(id: string): Promise<void> {
    await deleteGroup(id);
  }

  async createLabel(input: CreateLabelDto): Promise<LabelResponseDto | void> {
    const response = await createLabel(input);
    return response.data;
  }

  async listLabels(): Promise<LabelResponseDto[]> {
    const response = await listLabels();
    return response.data;
  }

  async getLabel(id: string): Promise<LabelResponseDto | void> {
    const response = await getLabel(id);
    return response.data;
  }

  async updateLabel(id: string, input: UpdateLabelDto): Promise<LabelResponseDto | void> {
    const response = await updateLabel(id, input);
    return response.data;
  }

  async deleteLabel(id: string): Promise<void> {
    await deleteLabel(id);
  }

  async createMember(input: CreateMemberDto): Promise<MemberResponseDto | void> {
    const response = await createMember(input);
    return response.data;
  }

  async listMembers(): Promise<MemberResponseDto[]> {
    const response = await listMembers();
    return response.data;
  }

  async getMember(id: string): Promise<MemberResponseDto | void> {
    const response = await getMember(id);
    return response.data;
  }

  async updateMember(id: string, input: UpdateMemberDto): Promise<MemberResponseDto | void> {
    const response = await updateMember(id, input);
    return response.data;
  }

  async deleteMember(id: string): Promise<void> {
    await deleteMember(id);
  }

  async createObservation(input: CreateObservationDto): Promise<ObservationResponseDto | void> {
    const response = await createObservation(input);
    return response.data;
  }

  async listObservations(): Promise<ObservationResponseDto[]> {
    const response = await listObservations();
    return response.data;
  }

  async getObservation(id: string): Promise<ObservationResponseDto | void> {
    const response = await getObservation(id);
    return response.data;
  }

  async updateObservation(id: string, input: UpdateObservationDto): Promise<ObservationResponseDto | void> {
    const response = await updateObservation(id, input);
    return response.data;
  }

  async deleteObservation(id: string): Promise<void> {
    await deleteObservation(id);
  }

  async createOrganization(input: CreateOrganizationDto): Promise<OrganizationResponseDto | void> {
    const response = await createOrganization(input);
    return response.data;
  }

  async listOrganizations(): Promise<OrganizationResponseDto[]> {
    const response = await listOrganizations();
    return response.data;
  }

  async getOrganization(id: string): Promise<OrganizationResponseDto | void> {
    const response = await getOrganization(id);
    return response.data;
  }

  async updateOrganization(id: string, input: UpdateOrganizationDto): Promise<OrganizationResponseDto | void> {
    const response = await updateOrganization(id, input);
    return response.data;
  }

  async deleteOrganization(id: string): Promise<void> {
    await deleteOrganization(id);
  }

  async createPermission(input: CreatePermissionDto): Promise<PermissionResponseDto | void> {
    const response = await createPermission(input);
    return response.data;
  }

  async listPermissions(): Promise<PermissionResponseDto[]> {
    const response = await listPermissions();
    return response.data;
  }

  async getPermission(id: string): Promise<PermissionResponseDto | void> {
    const response = await getPermission(id);
    return response.data;
  }

  async updatePermission(id: string, input: UpdatePermissionDto): Promise<PermissionResponseDto | void> {
    const response = await updatePermission(id, input);
    return response.data;
  }

  async deletePermission(id: string): Promise<void> {
    await deletePermission(id);
  }

  async createPlace(input: CreatePlaceDto): Promise<PlaceResponseDto | void> {
    const response = await createPlace(input);
    return response.data;
  }

  async listPlaces(): Promise<PlaceResponseDto[]> {
    const response = await listPlaces();
    return response.data;
  }

  async getPlace(id: string): Promise<PlaceResponseDto | void> {
    const response = await getPlace(id);
    return response.data;
  }

  async updatePlace(id: string, input: UpdatePlaceDto): Promise<PlaceResponseDto | void> {
    const response = await updatePlace(id, input);
    return response.data;
  }

  async deletePlace(id: string): Promise<void> {
    await deletePlace(id);
  }

  async createProtocol(input: CreateProtocolDto): Promise<ProtocolResponseDto | void> {
    const response = await createProtocol(input);
    return response.data;
  }

  async listProtocols(): Promise<ProtocolResponseDto[]> {
    const response = await listProtocols();
    return response.data;
  }

  async getProtocol(id: string): Promise<ProtocolResponseDto | void> {
    const response = await getProtocol(id);
    return response.data;
  }

  async updateProtocol(id: string, input: UpdateProtocolDto): Promise<ProtocolResponseDto | void> {
    const response = await updateProtocol(id, input);
    return response.data;
  }

  async deleteProtocol(id: string): Promise<void> {
    await deleteProtocol(id);
  }

  async createRelationship(input: CreateRelationshipDto): Promise<RelationshipResponseDto | void> {
    const response = await createRelationship(input);
    return response.data;
  }

  async listRelationships(): Promise<RelationshipResponseDto[]> {
    const response = await listRelationships();
    return response.data;
  }

  async getRelationship(id: string): Promise<RelationshipResponseDto | void> {
    const response = await getRelationship(id);
    return response.data;
  }

  async updateRelationship(id: string, input: UpdateRelationshipDto): Promise<RelationshipResponseDto | void> {
    const response = await updateRelationship(id, input);
    return response.data;
  }

  async deleteRelationship(id: string): Promise<void> {
    await deleteRelationship(id);
  }

  async createRelationshipType(input: CreateRelationshipTypeDto): Promise<RelationshipTypeResponseDto | void> {
    const response = await createRelationshipType(input);
    return response.data;
  }

  async listRelationshipTypes(): Promise<RelationshipTypeResponseDto[]> {
    const response = await listRelationshipTypes();
    return response.data;
  }

  async getRelationshipType(id: string): Promise<RelationshipTypeResponseDto | void> {
    const response = await getRelationshipType(id);
    return response.data;
  }

  async updateRelationshipType(id: string, input: UpdateRelationshipTypeDto): Promise<RelationshipTypeResponseDto | void> {
    const response = await updateRelationshipType(id, input);
    return response.data;
  }

  async deleteRelationshipType(id: string): Promise<void> {
    await deleteRelationshipType(id);
  }

  async createReviewComment(input: CreateReviewCommentDto): Promise<ReviewCommentResponseDto | void> {
    const response = await createReviewComment(input);
    return response.data;
  }

  async listReviewComments(): Promise<ReviewCommentResponseDto[]> {
    const response = await listReviewComments();
    return response.data;
  }

  async getReviewComment(id: string): Promise<ReviewCommentResponseDto | void> {
    const response = await getReviewComment(id);
    return response.data;
  }

  async updateReviewComment(id: string, input: UpdateReviewCommentDto): Promise<ReviewCommentResponseDto | void> {
    const response = await updateReviewComment(id, input);
    return response.data;
  }

  async deleteReviewComment(id: string): Promise<void> {
    await deleteReviewComment(id);
  }

  async createRole(input: CreateRoleDto): Promise<RoleResponseDto | void> {
    const response = await createRole(input);
    return response.data;
  }

  async listRoles(): Promise<RoleResponseDto[]> {
    const response = await listRoles();
    return response.data;
  }

  async getRole(id: string): Promise<RoleResponseDto | void> {
    const response = await getRole(id);
    return response.data;
  }

  async updateRole(id: string, input: UpdateRoleDto): Promise<RoleResponseDto | void> {
    const response = await updateRole(id, input);
    return response.data;
  }

  async deleteRole(id: string): Promise<void> {
    await deleteRole(id);
  }

  async createRule(input: CreateRuleDto): Promise<RuleResponseDto | void> {
    const response = await createRule(input);
    return response.data;
  }

  async listRules(): Promise<RuleResponseDto[]> {
    const response = await listRules();
    return response.data;
  }

  async getRule(id: string): Promise<RuleResponseDto | void> {
    const response = await getRule(id);
    return response.data;
  }

  async updateRule(id: string, input: UpdateRuleDto): Promise<RuleResponseDto | void> {
    const response = await updateRule(id, input);
    return response.data;
  }

  async deleteRule(id: string): Promise<void> {
    await deleteRule(id);
  }

  async createScope(input: CreateScopeDto): Promise<ScopeResponseDto | void> {
    const response = await createScope(input);
    return response.data;
  }

  async listScopes(): Promise<ScopeResponseDto[]> {
    const response = await listScopes();
    return response.data;
  }

  async getScope(id: string): Promise<ScopeResponseDto | void> {
    const response = await getScope(id);
    return response.data;
  }

  async updateScope(id: string, input: UpdateScopeDto): Promise<ScopeResponseDto | void> {
    const response = await updateScope(id, input);
    return response.data;
  }

  async deleteScope(id: string): Promise<void> {
    await deleteScope(id);
  }

  async createVote(input: CreateVoteDto): Promise<VoteResponseDto | void> {
    const response = await createVote(input);
    return response.data;
  }

  async listVotes(): Promise<VoteResponseDto[]> {
    const response = await listVotes();
    return response.data;
  }

  async getVote(id: string): Promise<VoteResponseDto | void> {
    const response = await getVote(id);
    return response.data;
  }

  async updateVote(id: string, input: UpdateVoteDto): Promise<VoteResponseDto | void> {
    const response = await updateVote(id, input);
    return response.data;
  }

  async deleteVote(id: string): Promise<void> {
    await deleteVote(id);
  }
}

/**
 * Specify a person's ranking within the permission system.
 *
 * A person (with appropriate permissions) can perform actions against those with a lower or no ranking.
 */
export const RBAC_PERMISSION_RANK = (rank: number) => `level.${rank}`;

/**
 * Permission to create a new person entry (pending approval).
 */
export const RBAC_PERMISSION_HR_MEMBER_CREATE = "hr.people.create";

/**
 * Permission to approve a new person entry and their identifier.
 */
export const RBAC_PERMISSION_HR_MEMBER_APPROVE = "hr.people.approve";

/**
 * Permission to grant someone else a certain position.
 */
export const RBAC_PERMISSION_HR_MEMBER_GRANT_POSITION = (position: string) =>
  `hr.people.grant.position.${position}`;

/**
 * Permission to grant someone else a certain role.
 */
export const RBAC_PERMISSION_HR_MEMBER_GRANT_ROLE = (role: string) =>
  `hr.people.grant.role.${role}`;

/**
 * Permission to access and use the moderation tools.
 */
export const RBAC_PERMISSION_MODERATION_AGENT = "moderation.agent";

/**
 * Permission to access and use the Discover requests tool.
 */
export const RBAC_PERMISSION_MODERATION_DISCOVER = "moderation.discover";

/**
 * Permission to create new comments on resources.
 */
export const RBAC_PERMISSION_COMMENT_CREATE = "moderation.comment.create";

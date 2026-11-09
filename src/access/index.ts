import type { Access, FieldAccess } from 'payload'

type Role = 'admin' | 'editor'

const hasRole = (user: unknown, roles: Role[]) => {
  const r = (user as { roles?: Role[] } | null)?.roles
  return Array.isArray(r) && r.some((role) => roles.includes(role))
}

/** Anyone, including visitors who are not signed in. */
export const anyone: Access = () => true

/** Any signed-in staff member (admin or editor). */
export const staff: Access = ({ req: { user } }) => Boolean(user)

/** Admins only: user management and other sensitive settings. */
export const admins: Access = ({ req: { user } }) => hasRole(user, ['admin'])

export const adminsField: FieldAccess = ({ req: { user } }) => hasRole(user, ['admin'])

/** Visitors see published items only; staff also see drafts. */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

/** Staff can read everything; visitors see only items switched on. */
export const visibleOrStaff =
  (field: string): Access =>
  ({ req: { user } }) => {
    if (user) return true
    return { [field]: { equals: true } }
  }

/** A signed-in admin, or the user editing their own account. */
export const adminsOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasRole(user, ['admin'])) return true
  return { id: { equals: user.id } }
}

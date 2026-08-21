import type {Access, FieldAccess} from 'payload';

import type {User} from '../payload-types';

// Roles replace the old Prisma `User.permission` JSON bag. `admin` is the only
// role allowed to manage users and site-wide settings; `editor` manages content.
export type Role = 'admin' | 'editor';

const hasRole = (user: unknown, role: Role): boolean =>
  Boolean(user && (user as User).roles?.includes(role));

export const isAdmin: Access = ({req: {user}}) => hasRole(user, 'admin');

export const isAdminOrEditor: Access = ({req: {user}}) =>
  hasRole(user, 'admin') || hasRole(user, 'editor');

export const isAdminFieldLevel: FieldAccess = ({req: {user}}) =>
  hasRole(user, 'admin');

// A user may always read/update their own document; admins may touch anyone's.
export const isAdminOrSelf: Access = ({req: {user}}) => {
  if (hasRole(user, 'admin')) return true;
  if (user) return {id: {equals: user.id}};
  return false;
};

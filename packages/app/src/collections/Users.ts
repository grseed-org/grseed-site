import type {CollectionConfig} from 'payload';

import {isAdmin, isAdminFieldLevel, isAdminOrSelf} from '../access/roles';

// Replaces the old Prisma `User` model + bespoke Elysia JWT/session stack.
// Payload `auth` owns email/password, login, and token issuance; the old
// `passwordHash`, `AuthSession`, refresh-token rotation, and Turnstile flow are
// intentionally dropped (see plan "Out of scope").
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {name: 'name', type: 'text', required: true},
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      options: [
        {label: 'Admin', value: 'admin'},
        {label: 'Editor', value: 'editor'},
      ],
      // Only admins may grant roles, even when editing their own profile.
      access: {update: isAdminFieldLevel},
    },
    {name: 'slug', type: 'text', unique: true, index: true},
    {name: 'avatar', type: 'upload', relationTo: 'media'},
    {name: 'bio', type: 'text'},
    {name: 'description', type: 'textarea'},
  ],
};

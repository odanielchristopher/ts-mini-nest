import { createDecorator } from '../../shared/utils/createDecorator';

export const REQUIRED_ROLES_KEY = 'custom:roles';

export const RequiredRoles = (roles: string[]) =>
  createDecorator(REQUIRED_ROLES_KEY, roles);

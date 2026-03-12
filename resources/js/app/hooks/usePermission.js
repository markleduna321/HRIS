import { usePage } from '@inertiajs/react';

/**
 * Hook to check if the authenticated user has a specific role
 * @param {string|array} roles - Role name(s) to check
 * @returns {boolean}
 */
export const useRole = (roles) => {
  const { auth } = usePage().props;
  
  if (!auth?.user?.roles) return false;
  
  const userRoles = auth.user.roles;
  const rolesToCheck = Array.isArray(roles) ? roles : [roles];
  
  return rolesToCheck.some(role => userRoles.includes(role));
};

/**
 * Hook to check if the authenticated user has a specific permission
 * @param {string|array} permissions - Permission name(s) to check
 * @returns {boolean}
 */
export const usePermission = (permissions) => {
  const { auth } = usePage().props;
  
  if (!auth?.user?.permissions) return false;
  
  const userPermissions = auth.user.permissions;
  const permissionsToCheck = Array.isArray(permissions) ? permissions : [permissions];
  
  return permissionsToCheck.some(permission => userPermissions.includes(permission));
};

/**
 * Hook to check if the authenticated user has any of the specified roles or permissions
 * @param {string|array} roles - Role name(s) to check
 * @param {string|array} permissions - Permission name(s) to check
 * @returns {boolean}
 */
export const useRoleOrPermission = (roles, permissions) => {
  return useRole(roles) || usePermission(permissions);
};

/**
 * Hook to check if the authenticated user has all specified roles
 * @param {array} roles - Array of role names
 * @returns {boolean}
 */
export const useAllRoles = (roles) => {
  const { auth } = usePage().props;
  
  if (!auth?.user?.roles) return false;
  
  const userRoles = auth.user.roles;
  const rolesToCheck = Array.isArray(roles) ? roles : [roles];
  
  return rolesToCheck.every(role => userRoles.includes(role));
};

/**
 * Hook to check if the authenticated user has all specified permissions
 * @param {array} permissions - Array of permission names
 * @returns {boolean}
 */
export const useAllPermissions = (permissions) => {
  const { auth } = usePage().props;
  
  if (!auth?.user?.permissions) return false;
  
  const userPermissions = auth.user.permissions;
  const permissionsToCheck = Array.isArray(permissions) ? permissions : [permissions];
  
  return permissionsToCheck.every(permission => userPermissions.includes(permission));
};

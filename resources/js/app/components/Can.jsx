import { useRole, usePermission, useAllRoles, useAllPermissions } from '../hooks/usePermission';

/**
 * Component to conditionally render children based on roles or permissions
 * @param {object} props
 * @param {string|array} props.role - Role(s) required to see the content
 * @param {string|array} props.permission - Permission(s) required to see the content
 * @param {boolean} props.requireAll - If true, requires ALL roles/permissions (default: false)
 * @param {React.ReactNode} props.children - Content to show if authorized
 * @param {React.ReactNode} props.fallback - Content to show if not authorized
 */
export default function Can({ role, permission, requireAll = false, children, fallback = null }) {
  let hasAccess = false;

  if (requireAll) {
    // Require ALL specified roles and permissions
    if (role && permission) {
      hasAccess = useAllRoles(role) && useAllPermissions(permission);
    } else if (role) {
      hasAccess = useAllRoles(role);
    } else if (permission) {
      hasAccess = useAllPermissions(permission);
    }
  } else {
    // Require ANY of the specified roles or permissions
    if (role && permission) {
      hasAccess = useRole(role) || usePermission(permission);
    } else if (role) {
      hasAccess = useRole(role);
    } else if (permission) {
      hasAccess = usePermission(permission);
    }
  }

  return hasAccess ? children : fallback;
}

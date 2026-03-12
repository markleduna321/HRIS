<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index()
    {
        $roles = Role::with('permissions')
            ->orderBy('name')
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'guard_name' => $role->guard_name,
                    'permissions' => $role->permissions->pluck('name'),
                    'permissions_count' => $role->permissions->count(),
                    'users_count' => $role->users()->count(),
                    'created_at' => $role->created_at->format('M d, Y'),
                ];
            });

        $permissions = Permission::orderBy('name')->get()->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
            ];
        });

        return Inertia::render('roles/page', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'level' => 'required|integer|min:1|max:5',
            'description' => 'nullable|string|max:1000',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'level' => $validated['level'],
            'description' => $validated['description'] ?? null,
        ]);

        if (!empty($validated['permissions'])) {
            $role->givePermissionTo($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Role created successfully.');
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($role->id)],
            'level' => 'required|integer|min:1|max:5',
            'description' => 'nullable|string|max:1000',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role->update([
            'name' => $validated['name'],
            'level' => $validated['level'],
            'description' => $validated['description'] ?? null,
        ]);

        // Sync permissions
        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role.
     */
    public function destroy(Role $role)
    {
        // Prevent deleting critical roles
        if (in_array($role->name, ['super_admin', 'admin', 'hr_manager', 'manager', 'employee'])) {
            return redirect()->back()->with('error', 'Cannot delete system roles.');
        }

        $role->delete();

        return redirect()->back()->with('success', 'Role deleted successfully.');
    }

    /**
     * Give permission to role.
     */
    public function givePermission(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permission' => 'required|exists:permissions,name',
        ]);

        $role->givePermissionTo($validated['permission']);

        return redirect()->back()->with('success', 'Permission granted to role.');
    }

    /**
     * Revoke permission from role.
     */
    public function revokePermission(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permission' => 'required|exists:permissions,name',
        ]);

        $role->revokePermissionTo($validated['permission']);

        return redirect()->back()->with('success', 'Permission revoked from role.');
    }
}

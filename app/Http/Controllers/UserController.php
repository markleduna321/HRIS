<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        $users = User::with(['roles', 'permissions'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_active' => $user->is_active,
                    'roles' => $user->roles->pluck('name'),
                    'permissions' => $user->permissions->pluck('name'),
                    'created_at' => $user->created_at->format('M d, Y'),
                ];
            });

        $roles = Role::with('permissions')
            ->orderBy('level', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($role) {
                // Group permissions for summary
                $permissionGroups = [];
                foreach ($role->permissions as $permission) {
                    $parts = explode(' ', $permission->name);
                    $action = $parts[0]; // view, create, edit, delete, approve
                    $module = implode(' ', array_slice($parts, 1)); // employees, users, etc.
                    
                    if (!isset($permissionGroups[$module])) {
                        $permissionGroups[$module] = [];
                    }
                    $permissionGroups[$module][] = $action;
                }
                
                // Create permission summary (e.g., "User Management (8), Employee Management (4)")
                $permissionSummary = [];
                foreach ($permissionGroups as $module => $actions) {
                    $moduleName = ucwords($module);
                    if ($moduleName === 'Own Attendance' || $moduleName === 'Own Leaves' || $moduleName === 'Own Payroll' || $moduleName === 'Own Performance') {
                        $moduleName = 'Personal ' . ucwords(str_replace('own ', '', $module));
                    }
                    $permissionSummary[] = $moduleName . ' (' . count($actions) . ')';
                }
                
                // Manual count of users with this role (Spatie doesn't have standard relationship)
                $usersCount = User::role($role->name)->count();
                
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'level' => $role->level,
                    'description' => $role->description,
                    'permissions' => $role->permissions->pluck('name'),
                    'permissions_count' => $role->permissions->count(),
                    'permission_summary' => implode(', ', array_slice($permissionSummary, 0, 3)) . (count($permissionSummary) > 3 ? '...' : ''),
                    'users_count' => $usersCount,
                    'created_at' => $role->created_at->format('M d, Y'),
                ];
            });

        $permissions = Permission::orderBy('name', 'asc')
            ->get()
            ->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'created_at' => $permission->created_at->format('M d, Y'),
                ];
            });

        $allRoles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
            ];
        });

        $allPermissions = Permission::all()->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
            ];
        });

        return Inertia::render('users/page', [
            'users' => $users,
            'roles' => $roles,
            'permissions' => $permissions,
            'allRoles' => $allRoles,
            'allPermissions' => $allPermissions,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'is_active' => 'boolean',
            'roles' => 'array',
            'roles.*' => 'exists:roles,name',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_active' => $validated['is_active'] ?? true,
            'email_verified_at' => now(),
        ]);

        if (!empty($validated['roles'])) {
            $user->assignRole($validated['roles']);
        }

        return redirect()->back()->with('success', 'User created successfully.');
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'is_active' => 'boolean',
            'roles' => 'array',
            'roles.*' => 'exists:roles,name',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_active' => $validated['is_active'] ?? $user->is_active,
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);

        // Sync roles
        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user)
    {
        // Prevent deleting your own account
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    /**
     * Assign role to user.
     */
    public function assignRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        $user->assignRole($validated['role']);

        return redirect()->back()->with('success', 'Role assigned successfully.');
    }

    /**
     * Remove role from user.
     */
    public function removeRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        $user->removeRole($validated['role']);

        return redirect()->back()->with('success', 'Role removed successfully.');
    }

    /**
     * Give permission to user.
     */
    public function givePermission(Request $request, User $user)
    {
        $validated = $request->validate([
            'permission' => 'required|exists:permissions,name',
        ]);

        $user->givePermissionTo($validated['permission']);

        return redirect()->back()->with('success', 'Permission granted successfully.');
    }

    /**
     * Revoke permission from user.
     */
    public function revokePermission(Request $request, User $user)
    {
        $validated = $request->validate([
            'permission' => 'required|exists:permissions,name',
        ]);

        $user->revokePermissionTo($validated['permission']);

        return redirect()->back()->with('success', 'Permission revoked successfully.');
    }
}

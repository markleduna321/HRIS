<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    /**
     * Display a listing of permissions.
     */
    public function index()
    {
        $permissions = Permission::with('roles')
            ->orderBy('name')
            ->get()
            ->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name,
                    'roles' => $permission->roles->pluck('name'),
                    'roles_count' => $permission->roles->count(),
                    'created_at' => $permission->created_at->format('M d, Y'),
                ];
            });

        $roles = Role::orderBy('name')->get()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
            ];
        });

        return Inertia::render('permissions/page', [
            'permissions' => $permissions,
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created permission.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);

        Permission::create(['name' => $validated['name']]);

        return redirect()->back()->with('success', 'Permission created successfully.');
    }

    /**
     * Update the specified permission.
     */
    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('permissions')->ignore($permission->id)],
        ]);

        $permission->update(['name' => $validated['name']]);

        return redirect()->back()->with('success', 'Permission updated successfully.');
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(Permission $permission)
    {
        $permission->delete();

        return redirect()->back()->with('success', 'Permission deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::with('permissions')->get();
        
        // Manually add users count for each role
        $roles->each(function ($role) {
            $role->users_count = User::role($role->name)->count();
        });
        
        return response()->json($roles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles,name',
            'level' => 'nullable|integer|min:1|max:5',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $role = Role::create([
            'name' => $request->name,
            'level' => $request->level ?? 1,
            'description' => $request->description,
        ]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        $role->load('permissions');
        $role->users_count = User::role($role->name)->count();
        
        return response()->json($role, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        $role->users_count = User::role($role->name)->count();
        return response()->json($role);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);
        
        // Prevent updating super_admin role
        if ($role->name === 'super_admin') {
            return response()->json([
                'message' => 'Cannot modify super admin role'
            ], 422);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:roles,name,' . $id,
            'level' => 'nullable|integer|min:1|max:5',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $role->update($request->only(['name', 'level', 'description']));

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        $role->load('permissions');
        $role->users_count = User::role($role->name)->count();
        
        return response()->json($role);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        
        // Prevent deleting super_admin role
        if ($role->name === 'super_admin') {
            return response()->json([
                'message' => 'Cannot delete super admin role'
            ], 422);
        }
        
        // Check if role has users
        if (User::role($role->name)->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete role with assigned users'
            ], 422);
        }
        
        $role->delete();
        
        return response()->json([
            'message' => 'Role deleted successfully'
        ]);
    }

    /**
     * Get all permissions
     */
    public function permissions()
    {
        $permissions = Permission::all();
        return response()->json($permissions);
    }

    /**
     * Assign permissions to a role
     */
    public function assignPermissions(Request $request, string $id)
    {
        $role = Role::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $role->givePermissionTo($request->permissions);
        $role->load('permissions');
        $role->users_count = User::role($role->name)->count();
        
        return response()->json($role);
    }

    /**
     * Sync permissions for a role
     */
    public function syncPermissions(Request $request, string $id)
    {
        $role = Role::findOrFail($id);
        
        // Prevent modifying super_admin permissions
        if ($role->name === 'super_admin') {
            return response()->json([
                'message' => 'Cannot modify super admin permissions'
            ], 422);
        }
        
        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $role->syncPermissions($request->permissions);
        $role->load('permissions');
        $role->users_count = User::role($role->name)->count();
        
        return response()->json($role);
    }

    /**
     * Get role statistics
     */
    public function stats()
    {
        $stats = [
            'total_roles' => Role::count(),
            'total_permissions' => Permission::count(),
            'roles_by_level' => Role::select('level')
                ->selectRaw('count(*) as count')
                ->groupBy('level')
                ->get(),
        ];
        
        return response()->json($stats);
    }

    /**
     * Get users with a specific role
     */
    public function users(string $id)
    {
        $role = Role::findOrFail($id);
        $users = User::role($role->name)->with('roles')->get();
        
        return response()->json($users);
    }
}

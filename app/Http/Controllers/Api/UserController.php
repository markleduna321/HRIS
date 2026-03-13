<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles.permissions')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'email' => $user->email,
                    'is_active' => $user->is_active,
                    'roles' => $user->roles,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ];
            });
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(8)],
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => $request->is_active ?? true,
            'email_verified_at' => now(),
        ]);

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        $user->load('roles.permissions');
        
        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with('roles.permissions')->findOrFail($id);
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => ['sometimes', Password::min(8)],
            'is_active' => 'sometimes|boolean',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $userData = $request->only(['first_name', 'last_name', 'email', 'is_active']);
        
        if ($request->has('password')) {
            $userData['password'] = Hash::make($request->password);
            $userData['password_changed_at'] = now();
        }

        $user->update($userData);

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        $user->load('roles.permissions');
        
        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting super admin
        if ($user->hasRole('super_admin')) {
            return response()->json([
                'message' => 'Cannot delete super admin user'
            ], 422);
        }
        
        $user->delete();
        
        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Activate a user
     */
    public function activate(string $id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => true]);
        $user->load('roles.permissions');
        
        return response()->json($user);
    }

    /**
     * Deactivate a user
     */
    public function deactivate(string $id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deactivating super admin
        if ($user->hasRole('super_admin')) {
            return response()->json([
                'message' => 'Cannot deactivate super admin user'
            ], 422);
        }
        
        $user->update(['is_active' => false]);
        $user->load('roles.permissions');
        
        return response()->json($user);
    }

    /**
     * Assign roles to a user
     */
    public function assignRoles(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->syncRoles($request->roles);
        $user->load('roles.permissions');
        
        return response()->json($user);
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'password' => ['required', Password::min(8), 'confirmed'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'password_changed_at' => now(),
        ]);
        
        return response()->json([
            'message' => 'Password reset successfully'
        ]);
    }
}

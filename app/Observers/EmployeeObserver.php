<?php

namespace App\Observers;

use App\Models\Employee;
use App\Models\User;
use App\Models\UserInformation;
use Illuminate\Support\Facades\Hash;

class EmployeeObserver
{
    /**
     * Handle the Employee "creating" event.
     * Auto-create a user account when an employee is created (if not already linked).
     */
    public function creating(Employee $employee): void
    {
        // Only create user if user_id is not already set
        if (!$employee->user_id) {
            // Get user information to create user account
            $userInfo = UserInformation::where('employee_id', $employee->id)->first();
            
            if ($userInfo && $userInfo->email) {
                // Generate a default password (should be sent to employee via email)
                $defaultPassword = 'employee123';
                
                // Create user account
                $user = User::create([
                    'first_name' => $userInfo->first_name ?? 'Employee',
                    'last_name' => $userInfo->last_name ?? 'User',
                    'email' => $userInfo->email,
                    'password' => Hash::make($defaultPassword),
                    'is_active' => true,
                    'email_verified_at' => now(),
                    'password_changed_at' => null, // Force password change on first login
                ]);
                
                // Assign default employee role
                $user->assignRole('employee');
                
                // Link user to employee
                $employee->user_id = $user->id;
                
                // Link user to user_information
                $userInfo->update(['user_id' => $user->id]);
            }
        }
    }

    /**
     * Handle the Employee "updated" event.
     * Sync changes to linked user if needed.
     */
    public function updated(Employee $employee): void
    {
        // No longer need to sync - personal data is in user_information table
        // This method can be used for other employee-specific logic in the future
    }

    /**
     * Handle the Employee "deleted" event.
     * Soft delete or deactivate the linked user account.
     */
    public function deleted(Employee $employee): void
    {
        if ($employee->user) {
            // Deactivate user account instead of deleting
            $employee->user->update(['is_active' => false]);
        }
    }

    /**
     * Handle the Employee "restored" event.
     * Reactivate the linked user account.
     */
    public function restored(Employee $employee): void
    {
        if ($employee->user) {
            $employee->user->update(['is_active' => true]);
        }
    }

    /**
     * Handle the Employee "force deleted" event.
     * Permanently delete the linked user account and user information.
     */
    public function forceDeleted(Employee $employee): void
    {
        if ($employee->user) {
            $employee->user->forceDelete();
        }
        
        // Also delete user information
        if ($employee->userInformation) {
            $employee->userInformation->forceDelete();
        }
    }
}

<?php

namespace App\Observers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EmployeeObserver
{
    /**
     * Handle the Employee "creating" event.
     * Auto-create a user account when an employee is created.
     */
    public function creating(Employee $employee): void
    {
        // Only create user if user_id is not already set
        if (!$employee->user_id) {
            // Generate email if not provided
            $email = $employee->email ?: $this->generateEmail($employee);
            
            // Generate a random password (should be sent to employee via email)
            $defaultPassword = 'employee123'; // You should change this to send via email
            
            // Create user account
            $user = User::create([
                'name' => $employee->first_name . ' ' . $employee->last_name,
                'email' => $email,
                'password' => Hash::make($defaultPassword),
                'is_active' => true,
                'email_verified_at' => now(),
                'password_changed_at' => null, // Force password change on first login
            ]);
            
            // Assign default employee role
            $user->assignRole('employee');
            
            // Link user to employee
            $employee->user_id = $user->id;
        }
    }

    /**
     * Handle the Employee "updated" event.
     * Update linked user's name and email when employee is updated.
     */
    public function updated(Employee $employee): void
    {
        if ($employee->user) {
            $updates = [];
            
            // Update name if employee name changed
            $fullName = $employee->first_name . ' ' . $employee->last_name;
            if ($employee->user->name !== $fullName) {
                $updates['name'] = $fullName;
            }
            
            // Update email if employee email changed
            if ($employee->email && $employee->user->email !== $employee->email) {
                $updates['email'] = $employee->email;
            }
            
            if (!empty($updates)) {
                $employee->user->update($updates);
            }
        }
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
     * Permanently delete the linked user account.
     */
    public function forceDeleted(Employee $employee): void
    {
        if ($employee->user) {
            $employee->user->forceDelete();
        }
    }

    /**
     * Generate email from employee name.
     */
    private function generateEmail(Employee $employee): string
    {
        $firstName = Str::slug($employee->first_name);
        $lastName = Str::slug($employee->last_name);
        $baseEmail = strtolower($firstName . '.' . $lastName);
        
        // Check if email already exists
        $email = $baseEmail . '@company.com';
        $counter = 1;
        
        while (User::where('email', $email)->exists()) {
            $email = $baseEmail . $counter . '@company.com';
            $counter++;
        }
        
        return $email;
    }
}

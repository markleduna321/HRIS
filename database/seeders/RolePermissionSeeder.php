<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Employee Management
            'view employees',
            'create employees',
            'edit employees',
            'delete employees',
            
            // Department Management
            'view departments',
            'create departments',
            'edit departments',
            'delete departments',
            
            // Attendance Management
            'view attendance',
            'create attendance',
            'edit attendance',
            'delete attendance',
            'view own attendance',
            
            // Leave Management
            'view leaves',
            'create leaves',
            'edit leaves',
            'delete leaves',
            'approve leaves',
            'view own leaves',
            'create own leaves',
            
            // Payroll Management
            'view payroll',
            'create payroll',
            'edit payroll',
            'delete payroll',
            'view own payroll',
            
            // Performance Management
            'view performance',
            'create performance',
            'edit performance',
            'delete performance',
            'view own performance',
            
            // User Management
            'view users',
            'create users',
            'edit users',
            'delete users',
            
            // Role & Permission Management
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',
            
            // Job Board Management
            'view job board',
            'create job applications',
            'view all applications',
            'manage applications',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        
        // Super Admin role - full system access
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'super_admin'],
            [
                'level' => 5,
                'description' => 'Full system access with all permissions. Can manage all aspects of the HRIS including roles and permissions.'
            ]
        );
        $superAdminRole->update(['level' => 5, 'description' => 'Full system access with all permissions. Can manage all aspects of the HRIS including roles and permissions.']);
        $superAdminRole->syncPermissions(Permission::all());

        // Admin role - manage employees, users, and HR functions (no role/permission management)
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            [
                'level' => 3,
                'description' => 'HR administrator with access to employee management, user management, and HR operations. Cannot modify roles or permissions.'
            ]
        );
        $adminRole->update(['level' => 3, 'description' => 'HR administrator with access to employee management, user management, and HR operations. Cannot modify roles or permissions.']);
        $adminRole->syncPermissions([
            'view employees', 'create employees', 'edit employees', 'delete employees',
            'view departments', 'create departments', 'edit departments', 'delete departments',
            'view attendance', 'create attendance', 'edit attendance', 'delete attendance',
            'view leaves', 'create leaves', 'edit leaves', 'delete leaves', 'approve leaves',
            'view payroll', 'create payroll', 'edit payroll', 'delete payroll',
            'view performance', 'create performance', 'edit performance', 'delete performance',
            'view users', 'create users', 'edit users', 'delete users',
        ]);

        // HR Manager role - same as admin (for backward compatibility)
        $hrManagerRole = Role::firstOrCreate(
            ['name' => 'hr_manager'],
            [
                'level' => 3,
                'description' => 'HR manager with access to employee and HR operations management.'
            ]
        );
        $hrManagerRole->update(['level' => 3, 'description' => 'HR manager with access to employee and HR operations management.']);
        $hrManagerRole->syncPermissions([
            'view employees', 'create employees', 'edit employees', 'delete employees',
            'view departments', 'create departments', 'edit departments', 'delete departments',
            'view attendance', 'create attendance', 'edit attendance', 'delete attendance',
            'view leaves', 'create leaves', 'edit leaves', 'approve leaves',
            'view payroll', 'create payroll', 'edit payroll',
            'view performance', 'create performance', 'edit performance',
            'view users', 'create users', 'edit users',
        ]);

        // Manager role - manage team
        $managerRole = Role::firstOrCreate(
            ['name' => 'manager'],
            [
                'level' => 2,
                'description' => 'Team manager with access to employee oversight, attendance, leaves, and performance management.'
            ]
        );
        $managerRole->update(['level' => 2, 'description' => 'Team manager with access to employee oversight, attendance, leaves, and performance management.']);
        $managerRole->syncPermissions([
            'view employees',
            'view departments',
            'view attendance', 'create attendance', 'edit attendance',
            'view leaves', 'approve leaves',
            'view performance', 'create performance', 'edit performance',
        ]);

        // Employee role - basic access
        $employeeRole = Role::firstOrCreate(
            ['name' => 'employee'],
            [
                'level' => 1,
                'description' => 'Basic employee access to view personal information, attendance, leaves, payroll, and performance records.'
            ]
        );
        $employeeRole->update(['level' => 1, 'description' => 'Basic employee access to view personal information, attendance, leaves, payroll, and performance records.']);
        $employeeRole->syncPermissions([
            'view employees',
            'view departments',
            'view own attendance',
            'view own leaves', 'create own leaves',
            'view own payroll',
            'view own performance',
        ]);

        // Applicant role - job seekers with limited access
        $applicantRole = Role::firstOrCreate(
            ['name' => 'applicant'],
            [
                'level' => 0,
                'description' => 'Job applicant with access only to job board and application submission.'
            ]
        );
        $applicantRole->update(['level' => 0, 'description' => 'Job applicant with access only to job board and application submission.']);
        $applicantRole->syncPermissions([
            'view job board',
            'create job applications',
        ]);
    }
}
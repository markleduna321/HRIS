<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call(RolePermissionSeeder::class);

        // Create super admin user (super admin doesn't need an employee record)
        $superAdmin = User::create([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'admin@hris.com',
            'password' => Hash::make('password'),
            'is_active' => true,
            'email_verified_at' => now(),
            'password_changed_at' => now(), // Super admin doesn't need to change password
        ]);
        $superAdmin->assignRole('super_admin');

        // Create sample employees with auto-generated user accounts
        // The EmployeeObserver will automatically create User accounts
        // for each employee with the 'employee' role
        $this->call(EmployeeSeeder::class);
        
        $this->command->info('');
        $this->command->info('===========================================');
        $this->command->info('Seeding completed!');
        $this->command->info('===========================================');
        $this->command->info('Super Admin Login:');
        $this->command->info('  Email: admin@hris.com');
        $this->command->info('  Password: password');
        $this->command->info('  Role: super_admin (full system access)');
        $this->command->info('');
        $this->command->info('Sample Employee Logins (auto-created):');
        $this->command->info('  maria.cruz@company.com / employee123');
        $this->command->info('  Role: employee + admin (HR manager - can manage employees/users)');
        $this->command->info('');
        $this->command->info('  juan.delacruz@company.com / employee123');
        $this->command->info('  Role: employee (limited access - view only)');
        $this->command->info('');
        $this->command->info('  ana.reyes@company.com / employee123');
        $this->command->info('  Role: employee (limited access - view only)');
        $this->command->info('===========================================');
    }
}


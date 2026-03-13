<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use App\Models\UserInformation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * This demonstrates the 3-table structure: User -> UserInformation <- Employee
     */
    public function run(): void
    {
        // Create departments first
        $hrDept = Department::create([
            'name' => 'Human Resources',
            'code' => 'HR',
            'description' => 'Human Resources Department',
        ]);

        $itDept = Department::create([
            'name' => 'Information Technology',
            'code' => 'IT',
            'description' => 'IT Department',
        ]);

        $accountingDept = Department::create([
            'name' => 'Accounting',
            'code' => 'ACCT',
            'description' => 'Accounting Department',
        ]);

        // Create employees with 3-table structure
        $employeesData = [
            [
                'user' => [
                    'first_name' => 'Maria',
                    'last_name' => 'Cruz',
                    'email' => 'maria.cruz@company.com',
                ],
                'user_info' => [
                    'first_name' => 'Maria',
                    'middle_name' => 'Santos',
                    'last_name' => 'Cruz',
                    'gender' => 'female',
                    'date_of_birth' => '1985-05-15',
                    'email' => 'maria.cruz@company.com',
                    'phone' => '09171234567',
                    'address' => '123 Main Street',
                    'city' => 'Makati',
                    'state' => 'Metro Manila',
                    'zip_code' => '1200',
                    'country' => 'Philippines',
                    'emergency_contact_name' => 'Juan Cruz',
                    'emergency_contact_phone' => '09171234568',
                    'emergency_contact_relationship' => 'Spouse',
                    'sss_number' => '34-1234567-8',
                    'philhealth_number' => '12-345678901-2',
                    'pagibig_number' => '1234-5678-9012',
                    'tin_number' => '123-456-789-000',
                ],
                'employee' => [
                    'employee_number' => 'EMP-001',
                    'department_id' => $hrDept->id,
                    'position' => 'HR Manager',
                    'date_hired' => '2020-01-15',
                    'employment_status' => 'regular',
                    'employment_type' => 'full-time',
                    'basic_salary' => 50000.00,
                ],
                'role' => 'admin', // HR Manager should have admin role
            ],
            [
                'user' => [
                    'first_name' => 'Juan',
                    'last_name' => 'Dela Cruz',
                    'email' => 'juan.delacruz@company.com',
                ],
                'user_info' => [
                    'first_name' => 'Juan',
                    'middle_name' => 'Dela',
                    'last_name' => 'Cruz',
                    'gender' => 'male',
                    'date_of_birth' => '1990-08-20',
                    'email' => 'juan.delacruz@company.com',
                    'phone' => '09181234567',
                    'address' => '456 Tech Avenue',
                    'city' => 'Quezon City',
                    'state' => 'Metro Manila',
                    'zip_code' => '1100',
                    'country' => 'Philippines',
                    'emergency_contact_name' => 'Maria Dela Cruz',
                    'emergency_contact_phone' => '09181234568',
                    'emergency_contact_relationship' => 'Mother',
                    'sss_number' => '34-2345678-9',
                    'philhealth_number' => '12-456789012-3',
                    'pagibig_number' => '2345-6789-0123',
                    'tin_number' => '234-567-890-000',
                ],
                'employee' => [
                    'employee_number' => 'EMP-002',
                    'department_id' => $itDept->id,
                    'position' => 'Senior Developer',
                    'date_hired' => '2021-03-01',
                    'employment_status' => 'regular',
                    'employment_type' => 'full-time',
                    'basic_salary' => 45000.00,
                ],
                'role' => 'employee',
            ],
            [
                'user' => [
                    'first_name' => 'Ana',
                    'last_name' => 'Reyes',
                    'email' => 'ana.reyes@company.com',
                ],
                'user_info' => [
                    'first_name' => 'Ana',
                    'middle_name' => 'Lopez',
                    'last_name' => 'Reyes',
                    'gender' => 'female',
                    'date_of_birth' => '1988-12-10',
                    'email' => 'ana.reyes@company.com',
                    'phone' => '09191234567',
                    'address' => '789 Business Street',
                    'city' => 'Pasig',
                    'state' => 'Metro Manila',
                    'zip_code' => '1600',
                    'country' => 'Philippines',
                    'emergency_contact_name' => 'Pedro Reyes',
                    'emergency_contact_phone' => '09191234568',
                    'emergency_contact_relationship' => 'Father',
                    'sss_number' => '34-3456789-0',
                    'philhealth_number' => '12-567890123-4',
                    'pagibig_number' => '3456-7890-1234',
                    'tin_number' => '345-678-901-000',
                ],
                'employee' => [
                    'employee_number' => 'EMP-003',
                    'department_id' => $accountingDept->id,
                    'position' => 'Accountant',
                    'date_hired' => '2019-06-15',
                    'employment_status' => 'regular',
                    'employment_type' => 'full-time',
                    'basic_salary' => 40000.00,
                ],
                'role' => 'employee',
            ],
        ];

        foreach ($employeesData as $data) {
            // 1. Create User account
            $user = User::create([
                'first_name' => $data['user']['first_name'],
                'last_name' => $data['user']['last_name'],
                'email' => $data['user']['email'],
                'password' => Hash::make('employee123'),
                'is_active' => true,
                'email_verified_at' => now(),
                'password_changed_at' => null, // Force password change on first login
            ]);

            // Assign role
            $user->assignRole($data['role']);

            // 2. Create UserInformation (personal data)
            $userInfo = UserInformation::create(array_merge(
                $data['user_info'],
                ['user_id' => $user->id]
            ));

            // 3. Create Employee (employment data)
            $employee = Employee::create(array_merge(
                $data['employee'],
                ['user_id' => $user->id]
            ));

            // 4. Link UserInformation to Employee
            $userInfo->update(['employee_id' => $employee->id]);
        }
    }
}


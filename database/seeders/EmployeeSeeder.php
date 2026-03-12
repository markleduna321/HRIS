<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * This demonstrates the auto-user creation workflow.
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

        // Create employees - Users will be auto-created by EmployeeObserver
        $employees = [
            [
                'employee_number' => 'EMP-001',
                'department_id' => $hrDept->id,
                'position' => 'HR Manager',
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
                'date_hired' => '2020-01-15',
                'employment_status' => 'active',
                'sss_number' => '34-1234567-8',
                'philhealth_number' => '12-345678901-2',
                'pagibig_number' => '1234-5678-9012',
                'tin_number' => '123-456-789-000',
            ],
            [
                'employee_number' => 'EMP-002',
                'department_id' => $itDept->id,
                'position' => 'Senior Developer',
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
                'date_hired' => '2021-03-01',
                'employment_status' => 'active',
                'sss_number' => '34-2345678-9',
                'philhealth_number' => '12-456789012-3',
                'pagibig_number' => '2345-6789-0123',
                'tin_number' => '234-567-890-000',
            ],
            [
                'employee_number' => 'EMP-003',
                'department_id' => $accountingDept->id,
                'position' => 'Accountant',
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
                'date_hired' => '2019-06-15',
                'employment_status' => 'active',
                'sss_number' => '34-3456789-0',
                'philhealth_number' => '12-567890123-4',
                'pagibig_number' => '3456-7890-1234',
                'tin_number' => '345-678-901-000',
            ],
        ];

        foreach ($employees as $employeeData) {
            $employee = Employee::create($employeeData);
            
            // The EmployeeObserver will automatically create a User account
            // and assign the 'employee' role
            
            // Optional: You can assign additional roles here if needed
            // For example, make the HR Manager an admin:
            if ($employee->position === 'HR Manager' && $employee->user) {
                $employee->user->syncRoles(['employee', 'admin']);
            }
        }
    }
}


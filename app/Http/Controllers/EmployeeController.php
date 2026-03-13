<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use App\Models\UserInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees.
     */
    public function index()
    {
        $employees = Employee::with(['department', 'user', 'userInformation'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($employee) {
                $userInfo = $employee->userInformation;
                return [
                    'id' => $employee->id,
                    'employee_number' => $employee->employee_number,
                    'full_name' => $userInfo ? $userInfo->full_name : 'N/A',
                    'first_name' => $userInfo->first_name ?? null,
                    'middle_name' => $userInfo->middle_name ?? null,
                    'last_name' => $userInfo->last_name ?? null,
                    'gender' => $userInfo->gender ?? null,
                    'date_of_birth' => $userInfo && $userInfo->date_of_birth ? $userInfo->date_of_birth->format('Y-m-d') : null,
                    'email' => $userInfo->email ?? null,
                    'phone' => $userInfo->phone ?? null,
                    'address' => $userInfo->address ?? null,
                    'city' => $userInfo->city ?? null,
                    'state' => $userInfo->state ?? null,
                    'zip_code' => $userInfo->zip_code ?? null,
                    'country' => $userInfo->country ?? null,
                    'position' => $employee->position,
                    'department_name' => $employee->department ? $employee->department->name : null,
                    'department_id' => $employee->department_id,
                    'date_hired' => $employee->date_hired?->format('Y-m-d'),
                    'employment_status' => $employee->employment_status,
                    'employment_type' => $employee->employment_type,
                    'basic_salary' => $employee->basic_salary,
                    'emergency_contact_name' => $userInfo->emergency_contact_name ?? null,
                    'emergency_contact_phone' => $userInfo->emergency_contact_phone ?? null,
                    'emergency_contact_relationship' => $userInfo->emergency_contact_relationship ?? null,
                    'sss_number' => $userInfo->sss_number ?? null,
                    'philhealth_number' => $userInfo->philhealth_number ?? null,
                    'pagibig_number' => $userInfo->pagibig_number ?? null,
                    'tin_number' => $userInfo->tin_number ?? null,
                    'user_email' => $employee->user ? $employee->user->email : null,
                    'created_at' => $employee->created_at->format('M d, Y'),
                ];
            });

        $departments = Department::all()->map(function ($dept) {
            return [
                'id' => $dept->id,
                'name' => $dept->name,
                'code' => $dept->code,
            ];
        });

        return Inertia::render('employees/page', [
            'employees' => $employees,
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created employee.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Employee-specific fields
            'employee_number' => 'required|string|unique:employees',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'date_hired' => 'required|date',
            'employment_status' => 'required|in:probationary,regular,contractual,resigned,terminated',
            'employment_type' => 'nullable|in:full-time,part-time,contractual',
            'basic_salary' => 'nullable|numeric|min:0',
            
            // Personal information (for UserInformation)
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'email' => 'required|email|unique:user_information,email',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:10',
            'country' => 'nullable|string|max:255',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:255',
            'sss_number' => 'nullable|string|max:50',
            'philhealth_number' => 'nullable|string|max:50',
            'pagibig_number' => 'nullable|string|max:50',
            'tin_number' => 'nullable|string|max:50',
        ]);

        DB::beginTransaction();
        try {
            // 1. Create User account
            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'password' => Hash::make('employee123'),
                'is_active' => true,
                'email_verified_at' => now(),
                'password_changed_at' => null,
            ]);

            // Assign employee role
            $user->assignRole('employee');

            // 2. Create UserInformation
            $userInfo = UserInformation::create([
                'user_id' => $user->id,
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'last_name' => $validated['last_name'],
                'gender' => $validated['gender'],
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'] ?? null,
                'city' => $validated['city'] ?? null,
                'state' => $validated['state'] ?? null,
                'zip_code' => $validated['zip_code'] ?? null,
                'country' => $validated['country'] ?? 'Philippines',
                'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
                'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
                'emergency_contact_relationship' => $validated['emergency_contact_relationship'] ?? null,
                'sss_number' => $validated['sss_number'] ?? null,
                'philhealth_number' => $validated['philhealth_number'] ?? null,
                'pagibig_number' => $validated['pagibig_number'] ?? null,
                'tin_number' => $validated['tin_number'] ?? null,
            ]);

            // 3. Create Employee
            $employee = Employee::create([
                'user_id' => $user->id,
                'employee_number' => $validated['employee_number'],
                'department_id' => $validated['department_id'],
                'position' => $validated['position'],
                'date_hired' => $validated['date_hired'],
                'employment_status' => $validated['employment_status'],
                'employment_type' => $validated['employment_type'] ?? 'full-time',
                'basic_salary' => $validated['basic_salary'] ?? 0,
            ]);

            // 4. Link UserInformation to Employee
            $userInfo->update(['employee_id' => $employee->id]);

            DB::commit();

            return redirect()->back()->with('success', 'Employee added successfully. User account created with password: employee123');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to create employee: ' . $e->getMessage()]);
        }
    }

    /**
     * Update the specified employee.
     */
    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            // Employee-specific fields
            'employee_number' => 'required|string|unique:employees,employee_number,' . $employee->id,
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'date_hired' => 'required|date',
            'employment_status' => 'required|in:probationary,regular,contractual,resigned,terminated',
            'employment_type' => 'nullable|in:full-time,part-time,contractual',
            'basic_salary' => 'nullable|numeric|min:0',
            
            // Personal information (for UserInformation)
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:10',
            'country' => 'nullable|string|max:255',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:255',
            'sss_number' => 'nullable|string|max:50',
            'philhealth_number' => 'nullable|string|max:50',
            'pagibig_number' => 'nullable|string|max:50',
            'tin_number' => 'nullable|string|max:50',
        ]);

        DB::beginTransaction();
        try {
            // 1. Update Employee employment data
            $employee->update([
                'employee_number' => $validated['employee_number'],
                'department_id' => $validated['department_id'],
                'position' => $validated['position'],
                'date_hired' => $validated['date_hired'],
                'employment_status' => $validated['employment_status'],
                'employment_type' => $validated['employment_type'] ?? 'full-time',
                'basic_salary' => $validated['basic_salary'] ?? 0,
            ]);

            // 2. Update UserInformation personal data
            if ($employee->userInformation) {
                $employee->userInformation->update([
                    'first_name' => $validated['first_name'],
                    'middle_name' => $validated['middle_name'] ?? null,
                    'last_name' => $validated['last_name'],
                    'gender' => $validated['gender'],
                    'date_of_birth' => $validated['date_of_birth'] ?? null,
                    'email' => $validated['email'],
                    'phone' => $validated['phone'],
                    'address' => $validated['address'] ?? null,
                    'city' => $validated['city'] ?? null,
                    'state' => $validated['state'] ?? null,
                    'zip_code' => $validated['zip_code'] ?? null,
                    'country' => $validated['country'] ?? 'Philippines',
                    'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
                    'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
                    'emergency_contact_relationship' => $validated['emergency_contact_relationship'] ?? null,
                    'sss_number' => $validated['sss_number'] ?? null,
                    'philhealth_number' => $validated['philhealth_number'] ?? null,
                    'pagibig_number' => $validated['pagibig_number'] ?? null,
                    'tin_number' => $validated['tin_number'] ?? null,
                ]);
            }

            // 3. Update User email if changed
            if ($employee->user && $employee->userInformation) {
                $employee->user->update([
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'email' => $validated['email'],
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Employee updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to update employee: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified employee.
     */
    public function destroy(Employee $employee)
    {
        // EmployeeObserver will deactivate the associated user
        $employee->delete();

        return redirect()->back()->with('success', 'Employee deleted successfully.');
    }
}

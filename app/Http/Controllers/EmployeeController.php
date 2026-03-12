<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees.
     */
    public function index()
    {
        $employees = Employee::with(['department', 'user'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'employee_number' => $employee->employee_number,
                    'full_name' => $employee->first_name . ' ' . $employee->last_name,
                    'first_name' => $employee->first_name,
                    'middle_name' => $employee->middle_name,
                    'last_name' => $employee->last_name,
                    'gender' => $employee->gender,
                    'date_of_birth' => $employee->date_of_birth?->format('Y-m-d'),
                    'email' => $employee->email,
                    'phone' => $employee->phone,
                    'address' => $employee->address,
                    'city' => $employee->city,
                    'state' => $employee->state,
                    'zip_code' => $employee->zip_code,
                    'country' => $employee->country,
                    'position' => $employee->position,
                    'department_name' => $employee->department ? $employee->department->name : null,
                    'department_id' => $employee->department_id,
                    'date_hired' => $employee->date_hired?->format('Y-m-d'),
                    'employment_status' => $employee->employment_status,
                    'emergency_contact_name' => $employee->emergency_contact_name,
                    'emergency_contact_phone' => $employee->emergency_contact_phone,
                    'emergency_contact_relationship' => $employee->emergency_contact_relationship,
                    'sss_number' => $employee->sss_number,
                    'philhealth_number' => $employee->philhealth_number,
                    'pagibig_number' => $employee->pagibig_number,
                    'tin_number' => $employee->tin_number,
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
            'employee_number' => 'required|string|unique:employees',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'email' => 'required|email|unique:employees,email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|string|max:10',
            'country' => 'nullable|string|max:255',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:20',
            'emergency_contact_relationship' => 'required|string|max:255',
            'date_hired' => 'required|date',
            'employment_status' => 'required|in:active,on_leave,resigned,terminated',
            'sss_number' => 'nullable|string|max:50',
            'philhealth_number' => 'nullable|string|max:50',
            'pagibig_number' => 'nullable|string|max:50',
            'tin_number' => 'nullable|string|max:50',
        ]);

        // Create employee - EmployeeObserver will auto-create user
        $employee = Employee::create($validated);

        return redirect()->back()->with('success', 'Employee added successfully. User account has been created with password: employee123');
    }

    /**
     * Update the specified employee.
     */
    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'employee_number' => 'required|string|unique:employees,employee_number,' . $employee->id,
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'email' => 'required|email|unique:employees,email,' . $employee->id,
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|string|max:10',
            'country' => 'nullable|string|max:255',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:20',
            'emergency_contact_relationship' => 'required|string|max:255',
            'date_hired' => 'required|date',
            'employment_status' => 'required|in:active,on_leave,resigned,terminated',
            'sss_number' => 'nullable|string|max:50',
            'philhealth_number' => 'nullable|string|max:50',
            'pagibig_number' => 'nullable|string|max:50',
            'tin_number' => 'nullable|string|max:50',
        ]);

        // Update employee - EmployeeObserver will sync user data
        $employee->update($validated);

        return redirect()->back()->with('success', 'Employee updated successfully.');
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

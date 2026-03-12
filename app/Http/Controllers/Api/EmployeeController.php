<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Employee::with(['department', 'user']);
        
        // Pagination
        $perPage = $request->input('per_page', 10);
        $employees = $query->latest()->paginate($perPage);
        
        return response()->json($employees);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_number' => 'required|string|unique:employees,employee_number',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'date_hired' => 'required|date',
            'employment_status' => 'required|in:active,inactive,terminated',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $employee = Employee::create($request->all());
        $employee->load(['department', 'user']);
        
        return response()->json($employee, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $employee = Employee::with(['department', 'user'])->findOrFail($id);
        return response()->json($employee);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $employee = Employee::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'employee_number' => 'sometimes|string|unique:employees,employee_number,' . $id,
            'department_id' => 'sometimes|exists:departments,id',
            'position' => 'sometimes|string|max:255',
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:employees,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'date_hired' => 'sometimes|date',
            'employment_status' => 'sometimes|in:active,inactive,terminated',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $employee->update($request->all());
        $employee->load(['department', 'user']);
        
        return response()->json($employee);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();
        
        return response()->json([
            'message' => 'Employee deleted successfully'
        ]);
    }
}

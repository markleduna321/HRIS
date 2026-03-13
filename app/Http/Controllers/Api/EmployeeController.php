<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use App\Models\UserInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Employee::with(['department', 'user', 'userInformation']);
        
        // Pagination
        $perPage = $request->input('per_page', 10);
        $paginated = $query->latest()->paginate($perPage);
        
        // Flatten userInformation fields onto each employee
        $paginated->getCollection()->transform(function ($employee) {
            $userInfo = $employee->userInformation;
            $employee->first_name = $userInfo->first_name ?? null;
            $employee->middle_name = $userInfo->middle_name ?? null;
            $employee->last_name = $userInfo->last_name ?? null;
            $employee->email = $userInfo->email ?? null;
            $employee->phone = $userInfo->phone ?? null;
            $employee->gender = $userInfo->gender ?? null;
            $employee->date_of_birth = $userInfo->date_of_birth ?? null;
            return $employee;
        });

        return response()->json($paginated);
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
            'email' => 'required|email|unique:user_information,email',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'date_hired' => 'required|date',
            'employment_status' => 'required|in:probationary,regular,contractual,resigned,terminated',
            'basic_salary' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $data = $request->all();
            
            // Create User
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'password' => Hash::make('employee123'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
            $user->assignRole('employee');

            // Create UserInformation
            $userInfo = UserInformation::create([
                'user_id' => $user->id,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'gender' => $data['gender'] ?? null,
                'date_of_birth' => $data['date_of_birth'] ?? null,
            ]);

            // Create Employee
            $employee = Employee::create([
                'user_id' => $user->id,
                'employee_number' => $data['employee_number'],
                'department_id' => $data['department_id'],
                'position' => $data['position'],
                'date_hired' => $data['date_hired'],
                'employment_status' => $data['employment_status'],
                'basic_salary' => $data['basic_salary'] ?? 0,
            ]);

            // Link UserInformation to Employee
            $userInfo->update(['employee_id' => $employee->id]);

            $employee->load(['department', 'user', 'userInformation']);
            
            DB::commit();
            return response()->json($employee, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $employee = Employee::with(['department', 'user', 'userInformation'])->findOrFail($id);
        $userInfo = $employee->userInformation;
        $employee->first_name = $userInfo->first_name ?? null;
        $employee->middle_name = $userInfo->middle_name ?? null;
        $employee->last_name = $userInfo->last_name ?? null;
        $employee->email = $userInfo->email ?? null;
        $employee->phone = $userInfo->phone ?? null;
        $employee->gender = $userInfo->gender ?? null;
        $employee->date_of_birth = $userInfo->date_of_birth ?? null;
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
            'email' => 'sometimes|email',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'date_hired' => 'sometimes|date',
            'employment_status' => 'sometimes|in:probationary,regular,contractual,resigned,terminated',
            'basic_salary' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $data = $request->all();
            
            // Update Employee employment data
            $employeeData = [];
            if (isset($data['employee_number'])) $employeeData['employee_number'] = $data['employee_number'];
            if (isset($data['department_id'])) $employeeData['department_id'] = $data['department_id'];
            if (isset($data['position'])) $employeeData['position'] = $data['position'];
            if (isset($data['date_hired'])) $employeeData['date_hired'] = $data['date_hired'];
            if (isset($data['employment_status'])) $employeeData['employment_status'] = $data['employment_status'];
            if (isset($data['basic_salary'])) $employeeData['basic_salary'] = $data['basic_salary'];
            
            if (!empty($employeeData)) {
                $employee->update($employeeData);
            }

            // Update UserInformation
            if ($employee->userInformation) {
                $userInfoData = [];
                if (isset($data['first_name'])) $userInfoData['first_name'] = $data['first_name'];
                if (isset($data['last_name'])) $userInfoData['last_name'] = $data['last_name'];
                if (isset($data['email'])) $userInfoData['email'] = $data['email'];
                if (isset($data['phone'])) $userInfoData['phone'] = $data['phone'];
                if (isset($data['gender'])) $userInfoData['gender'] = $data['gender'];
                if (isset($data['date_of_birth'])) $userInfoData['date_of_birth'] = $data['date_of_birth'];
                
                if (!empty($userInfoData)) {
                    $employee->userInformation->update($userInfoData);
                }
            }

            // Update User
            if ($employee->user && isset($data['email'])) {
                $employee->user->update(['email' => $data['email']]);
            }

            $employee->load(['department', 'user', 'userInformation']);
            
            DB::commit();
            return response()->json($employee);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update employee',
                'error' => $e->getMessage()
            ], 500);
        }
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

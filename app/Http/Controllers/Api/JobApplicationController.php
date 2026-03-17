<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\UserInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class JobApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = JobApplication::with(['jobPosting.department', 'user', 'interviews.scheduledBy']);

        // If 'mine' param is set, scope to current user
        if ($request->boolean('mine')) {
            $query->where('user_id', $request->user()->id);
        }

        // Filter by job posting if provided
        if ($request->has('job_posting_id')) {
            $query->where('job_posting_id', $request->job_posting_id);
        }

        // Filter by user (applicant) if provided
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $applications = $query->latest()->get();

        return response()->json($applications);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_posting_id' => 'required|exists:job_postings,id',
            'applicant_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'use_profile_resume' => 'nullable|boolean',
            'profile_resume_path' => 'nullable|string',
            'cover_letter_text' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if user already applied for this job
        $existingApplication = JobApplication::where('job_posting_id', $request->job_posting_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existingApplication) {
            return response()->json(['message' => 'You have already applied for this position'], 422);
        }

        $data = $request->except(['resume', 'use_profile_resume', 'profile_resume_path']);
        $data['user_id'] = $request->user()->id;
        $data['status'] = 'pending';

        // Handle resume upload or use profile resume
        if ($request->hasFile('resume')) {
            $resumePath = $request->file('resume')->store('job-applications/resumes', 'public');
            $data['resume_path'] = $resumePath;
        } elseif ($request->boolean('use_profile_resume') && $request->profile_resume_path) {
            // Use the existing profile resume path
            $data['resume_path'] = $request->profile_resume_path;
        }

        $application = JobApplication::create($data);

        return response()->json($application->load(['jobPosting', 'user']), 201);
    }

    public function show(JobApplication $jobApplication)
    {
        return response()->json($jobApplication->load(['jobPosting.department', 'user', 'reviewedBy']));
    }

    public function update(Request $request, JobApplication $jobApplication)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|required|in:pending,reviewing,shortlisted,interview,final_interview,job_offer,accepted,contract_signing,hired,rejected',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        // If status is being changed from pending, mark as reviewed
        if ($request->has('status') && $jobApplication->status === 'pending' && $request->status !== 'pending') {
            $data['reviewed_at'] = now();
            $data['reviewed_by'] = $request->user()->id;
        }

        $jobApplication->update($data);

        // Auto-create employee record when status becomes hired
        if ($request->input('status') === 'hired' && $jobApplication->wasChanged('status')) {
            $jobApplication->load(['jobPosting', 'user']);

            // Generate employee number in YYMMDDNN format (matching manual creation)
            $datePrefix = now()->format('ymd');
            $todayCount = Employee::withTrashed()
                ->where('employee_number', 'like', $datePrefix . '%')
                ->count();
            $nextSeq = str_pad($todayCount + 1, 2, '0', STR_PAD_LEFT);
            $employeeNumber = $datePrefix . $nextSeq;

            // Parse applicant name into first/last
            $nameParts = explode(' ', trim($jobApplication->applicant_name), 2);
            $firstName = $nameParts[0] ?? '';
            $lastName = $nameParts[1] ?? '';

            $employee = Employee::create([
                'employee_number' => $employeeNumber,
                'user_id' => $jobApplication->user_id,
                'department_id' => $jobApplication->jobPosting->department_id,
                'position' => $jobApplication->jobPosting->title,
                'date_hired' => now()->toDateString(),
                'employment_status' => 'probationary',
                'employment_type' => 'full-time',
                'basic_salary' => 0,
            ]);

            // Create UserInformation if it doesn't exist, or update with missing fields
            $existingInfo = UserInformation::where('user_id', $jobApplication->user_id)->first();
            if (!$existingInfo) {
                UserInformation::create([
                    'user_id' => $jobApplication->user_id,
                    'employee_id' => $employee->id,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $jobApplication->email,
                    'phone' => $jobApplication->phone,
                ]);
            } else {
                $updateData = ['employee_id' => $employee->id];
                if (!$existingInfo->first_name) $updateData['first_name'] = $firstName;
                if (!$existingInfo->last_name) $updateData['last_name'] = $lastName;
                if (!$existingInfo->email) $updateData['email'] = $jobApplication->email;
                if (!$existingInfo->phone) $updateData['phone'] = $jobApplication->phone;
                $existingInfo->update($updateData);
            }

            // Update user role from applicant to employee
            $user = $jobApplication->user;
            if ($user) {
                $user->removeRole('applicant');
                $user->assignRole('employee');
            }
        }

        return response()->json($jobApplication->load(['jobPosting', 'reviewedBy']));
    }

    public function destroy(JobApplication $jobApplication)
    {
        // Delete uploaded files if they exist
        if ($jobApplication->resume_path) {
            Storage::disk('public')->delete($jobApplication->resume_path);
        }
        if ($jobApplication->cover_letter_path) {
            Storage::disk('public')->delete($jobApplication->cover_letter_path);
        }

        $jobApplication->delete();

        return response()->json(['message' => 'Application deleted successfully']);
    }
}


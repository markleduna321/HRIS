<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeDocument;
use App\Models\JobApplication;
use App\Models\JobApplicationDocument;
use App\Models\JobPosting;
use App\Models\UserInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class JobApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = JobApplication::with(['jobPosting.department', 'user', 'interviews.scheduledBy', 'preEmploymentDocuments']);

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
        return response()->json($jobApplication->load(['jobPosting.department', 'user', 'reviewedBy', 'interviews.scheduledBy', 'preEmploymentDocuments']));
    }

    public function update(Request $request, JobApplication $jobApplication)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|required|in:pending,reviewing,shortlisted,interview,final_interview,job_offer,accepted,pre_employment_documents,hired,rejected',
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

            // Transfer job application documents to employee 201 files
            $this->transferDocumentsToEmployee($jobApplication, $employee, $request->user());
        }

        return response()->json($jobApplication->load(['jobPosting', 'reviewedBy', 'interviews.scheduledBy', 'preEmploymentDocuments']));
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

    /**
     * Transfer job application documents to employee 201 files
     */
    private function transferDocumentsToEmployee(JobApplication $jobApplication, Employee $employee, $uploadedBy)
    {
        try {
            // 1. Copy Resume to Employee Documents
            if ($jobApplication->resume_path && Storage::disk('public')->exists($jobApplication->resume_path)) {
                $resumePath = $jobApplication->resume_path;
                $fileInfo = pathinfo($resumePath);
                $fileSize = Storage::disk('public')->size($resumePath);

                EmployeeDocument::create([
                    'employee_id' => $employee->id,
                    'document_type' => 'Resume',
                    'document_name' => 'Resume - ' . $jobApplication->applicant_name,
                    'file_path' => $resumePath,
                    'file_type' => strtoupper($fileInfo['extension'] ?? 'pdf'),
                    'file_size' => $fileSize,
                    'description' => 'Resume from job application',
                    'uploaded_by' => $uploadedBy->id,
                ]);

                Log::info("Resume transferred to employee documents for employee {$employee->id}");
            }

            // 2. Copy all approved pre-employment documents
            $preEmploymentDocs = $jobApplication->preEmploymentDocuments()
                ->where('status', 'approved')
                ->get();

            // Map job application document types to employee document types
            $docTypeMap = [
                'nbi_clearance' => 'NBI Clearance',
                'police_clearance' => 'Police Clearance',
                'barangay_clearance' => 'Barangay Clearance',
                'medical_certificate' => 'Medical Certificate',
                'birth_certificate' => 'Birth Certificate',
                'valid_id' => 'Valid ID',
                'sss_form' => 'SSS Form',
                'philhealth_form' => 'PhilHealth Form',
                'pagibig_form' => 'Pag-IBIG Form',
                'tin_id' => 'TIN ID',
            ];

            foreach ($preEmploymentDocs as $doc) {
                if (Storage::disk('public')->exists($doc->file_path)) {
                    $fileInfo = pathinfo($doc->file_path);
                    $fileSize = Storage::disk('public')->size($doc->file_path);
                    $documentType = $docTypeMap[$doc->document_type] ?? ucwords(str_replace('_', ' ', $doc->document_type));

                    EmployeeDocument::create([
                        'employee_id' => $employee->id,
                        'document_type' => $documentType,
                        'document_name' => $documentType . ' - ' . $jobApplication->applicant_name,
                        'file_path' => $doc->file_path,
                        'file_type' => strtoupper($fileInfo['extension'] ?? 'pdf'),
                        'file_size' => $fileSize,
                        'description' => 'Pre-employment document from job application',
                        'uploaded_by' => $uploadedBy->id,
                    ]);

                    Log::info("Pre-employment document {$documentType} transferred to employee {$employee->id}");
                }
            }

            Log::info("Successfully transferred all documents to employee {$employee->id} for job application {$jobApplication->id}");
        } catch (\Exception $e) {
            Log::error("Failed to transfer documents to employee: " . $e->getMessage());
            // Don't fail the hiring process if document transfer fails
        }
    }
}


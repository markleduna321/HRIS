<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplicationDocument;
use App\Models\JobApplication;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class JobApplicationDocumentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = JobApplicationDocument::with(['jobApplication', 'uploadedBy', 'reviewedBy']);

        if ($request->has('job_application_id')) {
            $jobApplicationId = $request->job_application_id;
            $query->where('job_application_id', $jobApplicationId);
            
            // Verify user has permission to view documents for this application
            $jobApplication = JobApplication::find($jobApplicationId);
            if ($jobApplication) {
                $isOwner = $jobApplication->user_id == $user->id; // Use == instead of === for type coercion
                $isAdminOrHr = $user->hasAnyRole(['super_admin', 'admin', 'hr']);
                
                if (!$isOwner && !$isAdminOrHr) {
                    Log::warning('Document access denied', [
                        'user_id' => $user->id,
                        'application_user_id' => $jobApplication->user_id,
                        'has_roles' => $user->roles->pluck('name'),
                    ]);
                    return response()->json(['message' => 'Unauthorized'], 403);
                }
            }
        } else {
            // If no specific application requested, only show user's own documents unless admin/hr
            if (!$user->hasAnyRole(['super_admin', 'admin', 'hr'])) {
                $query->whereHas('jobApplication', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
            }
        }

        $documents = $query->latest()->get();
        return response()->json($documents);
    }

    public function store(Request $request)
    {
        // Get all valid document type keys (active and inactive, since we store the key)
        $validDocumentKeys = DocumentType::pluck('key')->toArray();
        
        $validator = Validator::make($request->all(), [
            'job_application_id' => 'required|exists:job_applications,id',
            'document_type' => ['required', 'string', function ($attribute, $value, $fail) use ($validDocumentKeys) {
                if (!in_array($value, $validDocumentKeys)) {
                    $fail('The selected document type is invalid.');
                }
            }],
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Verify user has permission to upload documents to this application
        $jobApplication = JobApplication::findOrFail($request->job_application_id);
        $user = $request->user();
        
        // Allow if user owns the application OR has admin/hr role
        $isOwner = $jobApplication->user_id == $user->id;
        $isAdminOrHr = $user->hasAnyRole(['super_admin', 'admin', 'hr']);
        
        if (!$isOwner && !$isAdminOrHr) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $file = $request->file('file');
        $filePath = $file->store('job-applications/pre-employment-documents', 'public');

        $document = JobApplicationDocument::create([
            'job_application_id' => $request->job_application_id,
            'document_type' => $request->document_type,
            'file_path' => $filePath,
            'original_filename' => $file->getClientOriginalName(),
            'notes' => $request->notes,
            'uploaded_by' => $user->id,
        ]);

        return response()->json($document->load(['uploadedBy']), 201);
    }

    public function destroy(JobApplicationDocument $jobApplicationDocument)
    {
        $user = request()->user();
        
        // Allow if user owns the application OR has admin/hr role
        $isOwner = $jobApplicationDocument->jobApplication->user_id == $user->id;
        $isAdminOrHr = $user->hasAnyRole(['super_admin', 'admin', 'hr']);
        
        if (!$isOwner && !$isAdminOrHr) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Delete file from storage
        if ($jobApplicationDocument->file_path) {
            Storage::disk('public')->delete($jobApplicationDocument->file_path);
        }

        $jobApplicationDocument->delete();
        return response()->json(['message' => 'Document deleted successfully']);
    }

    public function approve(Request $request, JobApplicationDocument $jobApplicationDocument)
    {
        $user = $request->user();
        
        // Only HR/Admin can approve
        if (!$user->hasAnyRole(['super_admin', 'admin', 'hr'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $jobApplicationDocument->update([
            'status' => 'approved',
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
            'rejection_reason' => null,
        ]);

        return response()->json($jobApplicationDocument->load(['reviewedBy']));
    }

    public function reject(Request $request, JobApplicationDocument $jobApplicationDocument)
    {
        $user = $request->user();
        
        // Only HR/Admin can reject
        if (!$user->hasAnyRole(['super_admin', 'admin', 'hr'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'rejection_reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $jobApplicationDocument->update([
            'status' => 'rejected',
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
            'rejection_reason' => $request->rejection_reason,
        ]);

        return response()->json($jobApplicationDocument->load(['reviewedBy']));
    }
}

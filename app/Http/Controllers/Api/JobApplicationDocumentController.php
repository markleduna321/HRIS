<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplicationDocument;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class JobApplicationDocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = JobApplicationDocument::with(['jobApplication', 'uploadedBy']);

        if ($request->has('job_application_id')) {
            $query->where('job_application_id', $request->job_application_id);
        }

        $documents = $query->latest()->get();
        return response()->json($documents);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_application_id' => 'required|exists:job_applications,id',
            'document_type' => 'required|in:nbi_clearance,police_clearance,barangay_clearance,medical_certificate,birth_certificate,valid_id,sss_form,philhealth_form,pagibig_form,tin_id,certificate_of_employment,diploma,transcript_of_records,other',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $filePath = $file->store('job-applications/pre-employment-documents', 'public');

        $document = JobApplicationDocument::create([
            'job_application_id' => $request->job_application_id,
            'document_type' => $request->document_type,
            'file_path' => $filePath,
            'original_filename' => $file->getClientOriginalName(),
            'notes' => $request->notes,
            'uploaded_by' => $request->user()->id,
        ]);

        return response()->json($document->load(['uploadedBy']), 201);
    }

    public function destroy(JobApplicationDocument $jobApplicationDocument)
    {
        // Delete file from storage
        if ($jobApplicationDocument->file_path) {
            Storage::disk('public')->delete($jobApplicationDocument->file_path);
        }

        $jobApplicationDocument->delete();
        return response()->json(['message' => 'Document deleted successfully']);
    }
}

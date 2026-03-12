<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmployeeDocument;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class EmployeeDocumentController extends Controller
{
    /**
     * Display a listing of documents.
     * Can filter by employee_id or get all documents.
     */
    public function index(Request $request)
    {
        $query = EmployeeDocument::with(['employee', 'uploader']);

        // Filter by employee if provided
        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        // Filter by document type if provided
        if ($request->has('document_type')) {
            $query->where('document_type', $request->document_type);
        }

        $documents = $query->orderBy('created_at', 'desc')->get();

        return response()->json($documents);
    }

    /**
     * Store a newly created document.
     */
    public function store(Request $request)
    {
        // Log incoming request for debugging
        Log::info('Document upload request received', [
            'has_file' => $request->hasFile('file'),
            'all_files' => $request->allFiles(),
            'all_data' => $request->except('file'),
        ]);

        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'document_type' => 'required|string|max:255',
            'document_name' => 'required|string|max:255',
            'file' => 'required|file|max:2048', // 2MB max (matching PHP upload_max_filesize)
            'description' => 'nullable|string',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $file = $request->file('file');
            
            if (!$file) {
                Log::error('File not found in request');
                return response()->json(['errors' => ['file' => ['No file was uploaded']]], 422);
            }
            
            if (!$file->isValid()) {
                Log::error('Invalid file', ['error' => $file->getError()]);
                return response()->json(['errors' => ['file' => ['The uploaded file is invalid']]], 422);
            }
            
            $employee = Employee::findOrFail($request->employee_id);
            
            // Generate unique filename
            $filename = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('employee_documents/' . $request->employee_id, $filename, 'public');

            $document = EmployeeDocument::create([
                'employee_id' => $request->employee_id,
                'document_type' => $request->document_type,
                'document_name' => $request->document_name,
                'file_path' => $filePath,
                'file_type' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
                'description' => $request->description,
                'issue_date' => $request->issue_date,
                'expiry_date' => $request->expiry_date,
                'uploaded_by' => auth()->id(),
            ]);

            $document->load(['employee', 'uploader']);

            return response()->json([
                'message' => 'Document uploaded successfully',
                'document' => $document,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to upload document: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified document.
     */
    public function show(string $id)
    {
        $document = EmployeeDocument::with(['employee', 'uploader'])->findOrFail($id);
        return response()->json($document);
    }

    /**
     * Download the specified document.
     */
    public function download(string $id)
    {
        $document = EmployeeDocument::findOrFail($id);
        
        if (!Storage::disk('public')->exists($document->file_path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        return Storage::disk('public')->download($document->file_path, $document->document_name . '.' . $document->file_type);
    }

    /**
     * Update the specified document metadata.
     */
    public function update(Request $request, string $id)
    {
        $document = EmployeeDocument::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'document_type' => 'sometimes|required|string|max:255',
            'document_name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $document->update($request->only([
            'document_type',
            'document_name',
            'description',
            'issue_date',
            'expiry_date',
        ]));

        $document->load(['employee', 'uploader']);

        return response()->json([
            'message' => 'Document updated successfully',
            'document' => $document,
        ]);
    }

    /**
     * Remove the specified document.
     */
    public function destroy(string $id)
    {
        $document = EmployeeDocument::findOrFail($id);
        
        // Delete file from storage
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return response()->json(['message' => 'Document deleted successfully']);
    }

    /**
     * Get document types for dropdown.
     */
    public function documentTypes()
    {
        $types = [
            'Resume/CV',
            'Employment Contract',
            'NBI Clearance',
            'Medical Certificate',
            'Birth Certificate',
            'Marriage Certificate',
            'SSS',
            'PhilHealth',
            'Pag-IBIG',
            'TIN',
            'Diploma',
            'Transcript of Records',
            'Certificate of Employment',
            'Clearance',
            'Performance Evaluation',
            'Training Certificate',
            'Other',
        ];

        return response()->json($types);
    }
}

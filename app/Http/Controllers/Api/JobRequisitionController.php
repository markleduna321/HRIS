<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobRequisition;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class JobRequisitionController extends Controller
{
    /**
     * Display a listing of job requisitions.
     */
    public function index(Request $request)
    {
        $query = JobRequisition::with(['department', 'requestedBy', 'approvedBy', 'existingJobPosting']);

        // Filter by status - check for non-empty value
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority - check for non-empty value
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Search - check for non-empty value
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('requisition_number', 'like', "%{$search}%")
                    ->orWhere('position_title', 'like', "%{$search}%")
                    ->orWhereHas('department', function ($dq) use ($search) {
                        $dq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $requisitions = $query->latest()->get();

        return response()->json($requisitions);
    }

    /**
     * Get statistics for the dashboard
     */
    public function statistics()
    {
        $stats = [
            'total' => JobRequisition::count(),
            'pending' => JobRequisition::where('status', 'pending')->count(),
            'approved' => JobRequisition::where('status', 'approved')->count(),
            'in_progress' => JobRequisition::where('status', 'in_progress')->count(),
            'filled' => JobRequisition::where('status', 'filled')->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Store a newly created job requisition.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'position_type' => ['required', Rule::in(['new', 'existing'])],
            'existing_job_posting_id' => ['nullable', 'exists:job_postings,id'],
            'position_title' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'location' => 'nullable|string|max:255',
            'employment_type' => ['required', Rule::in(['full-time', 'part-time', 'contract', 'internship'])],
            'number_of_positions' => 'required|integer|min:1',
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'salary_range' => 'nullable|string|max:255',
            'target_start_date' => 'nullable|date',
            'justification' => 'required|string',
            'required_qualifications' => 'required|string',
            'key_responsibilities' => 'required|string',
        ]);

        $validated['requested_by'] = Auth::id();

        $requisition = JobRequisition::create($validated);
        $requisition->load(['department', 'requestedBy']);

        return response()->json($requisition, 201);
    }

    /**
     * Display the specified job requisition.
     */
    public function show(JobRequisition $jobRequisition)
    {
        $jobRequisition->load(['department', 'requestedBy', 'approvedBy', 'existingJobPosting', 'jobPostings']);
        return response()->json($jobRequisition);
    }

    /**
     * Update the specified job requisition.
     */
    public function update(Request $request, JobRequisition $jobRequisition)
    {
        // Only allow editing if status is pending or rejected
        if (!in_array($jobRequisition->status, ['pending', 'rejected'])) {
            return response()->json([
                'message' => 'Cannot edit requisition with status: ' . $jobRequisition->status
            ], 403);
        }

        $validated = $request->validate([
            'position_type' => ['required', Rule::in(['new', 'existing'])],
            'existing_job_posting_id' => ['nullable', 'exists:job_postings,id'],
            'position_title' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'location' => 'nullable|string|max:255',
            'employment_type' => ['required', Rule::in(['full-time', 'part-time', 'contract', 'internship'])],
            'number_of_positions' => 'required|integer|min:1',
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'salary_range' => 'nullable|string|max:255',
            'target_start_date' => 'nullable|date',
            'justification' => 'required|string',
            'required_qualifications' => 'required|string',
            'key_responsibilities' => 'required|string',
        ]);

        // Reset to pending if it was rejected
        if ($jobRequisition->status === 'rejected') {
            $validated['status'] = 'pending';
            $validated['rejection_reason'] = null;
        }

        $jobRequisition->update($validated);
        $jobRequisition->load(['department', 'requestedBy', 'approvedBy']);

        return response()->json($jobRequisition);
    }

    /**
     * Approve a job requisition
     */
    public function approve(Request $request, JobRequisition $jobRequisition)
    {
        if ($jobRequisition->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending requisitions can be approved.'
            ], 403);
        }

        $jobRequisition->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
            'is_new' => false,
        ]);

        $jobRequisition->load(['department', 'requestedBy', 'approvedBy']);

        return response()->json($jobRequisition);
    }

    /**
     * Reject a job requisition
     */
    public function reject(Request $request, JobRequisition $jobRequisition)
    {
        if ($jobRequisition->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending requisitions can be rejected.'
            ], 403);
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $jobRequisition->update([
            'status' => 'rejected',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
            'rejection_reason' => $validated['rejection_reason'],
            'is_new' => false,
        ]);

        $jobRequisition->load(['department', 'requestedBy', 'approvedBy']);

        return response()->json($jobRequisition);
    }

    /**
     * Mark requisition as in progress
     */
    public function markInProgress(JobRequisition $jobRequisition)
    {
        if ($jobRequisition->status !== 'approved') {
            return response()->json([
                'message' => 'Only approved requisitions can be marked as in progress.'
            ], 403);
        }

        $jobRequisition->update([
            'status' => 'in_progress',
            'is_new' => false,
        ]);

        $jobRequisition->load(['department', 'requestedBy', 'approvedBy']);

        return response()->json($jobRequisition);
    }

    /**
     * Cancel a job requisition
     */
    public function cancel(JobRequisition $jobRequisition)
    {
        if (in_array($jobRequisition->status, ['filled', 'cancelled'])) {
            return response()->json([
                'message' => 'This requisition cannot be cancelled.'
            ], 403);
        }

        $jobRequisition->update([
            'status' => 'cancelled',
            'is_new' => false,
        ]);

        $jobRequisition->load(['department', 'requestedBy', 'approvedBy']);

        return response()->json($jobRequisition);
    }

    /**
     * Remove the specified job requisition from storage.
     */
    public function destroy(JobRequisition $jobRequisition)
    {
        // Only allow deletion if status is pending, rejected, or cancelled, and no job postings linked
        if (!in_array($jobRequisition->status, ['pending', 'rejected', 'cancelled'])) {
            return response()->json([
                'message' => 'Cannot delete requisition with status: ' . $jobRequisition->status
            ], 403);
        }

        if ($jobRequisition->jobPostings()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete requisition that has associated job postings.'
            ], 403);
        }

        $jobRequisition->delete();

        return response()->json(['message' => 'Job requisition deleted successfully']);
    }

    /**
     * Get all existing job postings for selection
     */
    public function getExistingPositions()
    {
        $positions = JobPosting::select('id', 'title', 'department_id', 'location', 'employment_type')
            ->with('department:id,name')
            ->where('status', 'open')
            ->get();

        return response()->json($positions);
    }

    /**
     * Mark "is_new" as false for a requisition
     */
    public function markAsViewed(JobRequisition $jobRequisition)
    {
        $jobRequisition->update(['is_new' => false]);
        return response()->json($jobRequisition);
    }
}

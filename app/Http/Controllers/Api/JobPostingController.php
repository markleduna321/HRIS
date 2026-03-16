<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class JobPostingController extends Controller
{
    public function index(Request $request)
    {
        $query = JobPosting::with(['department', 'postedBy', 'jobRequisition'])
            ->withCount('applications');

        // Filter by status if provided
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }
        // If no filter, show all job postings

        $jobPostings = $query->latest()->get();

        return response()->json($jobPostings);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_requisition_id' => 'nullable|exists:job_requisitions,id',
            'title' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'location' => 'nullable|string|max:255',
            'employment_type' => 'required|in:full-time,part-time,contract,internship',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'responsibilities' => 'nullable|string',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'status' => 'nullable|in:open,closed,draft',
            'closing_date' => 'nullable|date|after:today',
            'positions_available' => 'nullable|integer|min:1',
            'target_audience' => 'nullable|in:both,applicants,employees',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $jobPosting = JobPosting::create([
            ...$request->all(),
            'posted_by' => $request->user()->id,
        ]);

        return response()->json($jobPosting->load(['department', 'postedBy']), 201);
    }

    public function show(JobPosting $jobPosting)
    {
        return response()->json($jobPosting->load(['department', 'postedBy', 'applications']));
    }

    public function update(Request $request, JobPosting $jobPosting)
    {
        $validator = Validator::make($request->all(), [
            'job_requisition_id' => 'nullable|exists:job_requisitions,id',
            'title' => 'sometimes|required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'location' => 'nullable|string|max:255',
            'employment_type' => 'sometimes|required|in:full-time,part-time,contract,internship',
            'description' => 'sometimes|required|string',
            'requirements' => 'nullable|string',
            'responsibilities' => 'nullable|string',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'status' => 'nullable|in:open,closed,draft',
            'closing_date' => 'nullable|date|after:today',
            'positions_available' => 'nullable|integer|min:1',
            'target_audience' => 'nullable|in:both,applicants,employees',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $jobPosting->update($request->all());

        return response()->json($jobPosting->load(['department', 'postedBy']));
    }

    public function destroy(JobPosting $jobPosting)
    {
        $jobPosting->delete();

        return response()->json(['message' => 'Job posting deleted successfully']);
    }
}


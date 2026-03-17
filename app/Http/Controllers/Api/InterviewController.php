<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InterviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Interview::with(['jobApplication.jobPosting.department', 'jobApplication.user', 'scheduledBy']);

        if ($request->has('job_application_id')) {
            $query->where('job_application_id', $request->job_application_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_application_id' => 'required|exists:job_applications,id',
            'type' => 'sometimes|in:initial,final',
            'mode' => 'required|in:online,in-person',
            'interview_date' => 'required|date',
            'interview_time' => 'required',
            'meeting_link' => 'required_if:mode,online|nullable|string|max:500',
            'location' => 'required_if:mode,in-person|nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $interviewType = $request->input('type', 'initial');

        $interview = Interview::create([
            ...$validator->validated(),
            'type' => $interviewType,
            'scheduled_by' => $request->user()->id,
        ]);

        // Update the application status based on interview type
        $application = JobApplication::find($request->job_application_id);
        if ($application) {
            $newStatus = $interviewType === 'final' ? 'final_interview' : 'interview';
            $application->update(['status' => $newStatus]);
        }

        return response()->json(
            $interview->load(['jobApplication.jobPosting.department', 'jobApplication.user', 'scheduledBy']),
            201
        );
    }

    public function show(Interview $interview)
    {
        return response()->json(
            $interview->load(['jobApplication.jobPosting.department', 'jobApplication.user', 'scheduledBy'])
        );
    }

    public function update(Request $request, Interview $interview)
    {
        $validator = Validator::make($request->all(), [
            'mode' => 'sometimes|in:online,in-person',
            'interview_date' => 'sometimes|date',
            'interview_time' => 'sometimes',
            'meeting_link' => 'nullable|string|max:500',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:scheduled,completed,cancelled,no-show',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $interview->update($validator->validated());

        return response()->json(
            $interview->load(['jobApplication.jobPosting.department', 'jobApplication.user', 'scheduledBy'])
        );
    }

    public function destroy(Interview $interview)
    {
        $interview->delete();
        return response()->json(['message' => 'Interview deleted successfully.']);
    }
}

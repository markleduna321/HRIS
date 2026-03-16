<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkExperience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WorkExperienceController extends Controller
{
    /**
     * Display a listing of the user's work experiences.
     */
    public function index(Request $request)
    {
        $experiences = $request->user()
            ->workExperiences()
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json($experiences);
    }

    /**
     * Store a newly created work experience.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'position_title' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'currently_working' => 'boolean',
            'job_description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $experience = $request->user()->workExperiences()->create($validator->validated());

        return response()->json($experience, 201);
    }

    /**
     * Update the specified work experience.
     */
    public function update(Request $request, WorkExperience $workExperience)
    {
        // Ensure the work experience belongs to the authenticated user
        if ($workExperience->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'position_title' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'currently_working' => 'boolean',
            'job_description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $workExperience->update($validator->validated());

        return response()->json($workExperience);
    }

    /**
     * Remove the specified work experience.
     */
    public function destroy(Request $request, WorkExperience $workExperience)
    {
        // Ensure the work experience belongs to the authenticated user
        if ($workExperience->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $workExperience->delete();

        return response()->json(['message' => 'Work experience deleted successfully']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SkillController extends Controller
{
    /**
     * Get all available skills.
     */
    public function index()
    {
        $skills = Skill::orderBy('name')->get();
        return response()->json($skills);
    }

    /**
     * Get the user's skills.
     */
    public function userSkills(Request $request)
    {
        $skills = $request->user()->skills;
        return response()->json($skills);
    }

    /**
     * Sync user's skills (add or remove).
     */
    public function syncSkills(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'skills' => 'required|array',
            'skills.*' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $skillIds = [];
        foreach ($request->skills as $skillName) {
            $skill = Skill::firstOrCreate(
                ['name' => $skillName],
                ['name' => $skillName]
            );
            $skillIds[] = $skill->id;
        }

        // Sync skills (this will add new and remove old ones not in the array)
        $request->user()->skills()->sync($skillIds);

        return response()->json([
            'message' => 'Skills updated successfully',
            'skills' => $request->user()->skills
        ]);
    }

    /**
     * Add a skill to the user's skills.
     */
    public function addSkill(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'skill_name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $skill = Skill::firstOrCreate(
            ['name' => $request->skill_name],
            ['name' => $request->skill_name]
        );

        // Attach the skill if not already attached
        if (!$request->user()->skills()->where('skill_id', $skill->id)->exists()) {
            $request->user()->skills()->attach($skill->id);
        }

        return response()->json([
            'message' => 'Skill added successfully',
            'skill' => $skill
        ]);
    }

    /**
     * Remove a skill from the user's skills.
     */
    public function removeSkill(Request $request, Skill $skill)
    {
        $request->user()->skills()->detach($skill->id);

        return response()->json([
            'message' => 'Skill removed successfully'
        ]);
    }
}

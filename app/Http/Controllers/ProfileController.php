<?php

namespace App\Http\Controllers;

use App\Models\UserInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function show(Request $request)
    {
        return Inertia::render('profile/page', [
            'user' => $request->user()->load(['roles', 'userInformation', 'workExperiences', 'skills'])
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:50'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', 'in:male,female,other'],
            'civil_status' => ['nullable', 'in:single,married,widowed,separated,divorced'],
            'nationality' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'barangay' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'zip_code' => ['nullable', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:255'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
            'emergency_contact_relationship' => ['nullable', 'string', 'max:255'],
            'sss_number' => ['nullable', 'string', 'max:50'],
            'philhealth_number' => ['nullable', 'string', 'max:50'],
            'pagibig_number' => ['nullable', 'string', 'max:50'],
            'tin_number' => ['nullable', 'string', 'max:50'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'portfolio_url' => ['nullable', 'url', 'max:255'],
        ]);

        DB::beginTransaction();
        try {
            // Update User table (auth data only)
            $user->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
            ]);

            // Prepare UserInformation data
            $userInfoData = [
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'last_name' => $validated['last_name'],
                'suffix' => $validated['suffix'] ?? null,
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'civil_status' => $validated['civil_status'] ?? null,
                'nationality' => $validated['nationality'] ?? null,
                'address' => $validated['address'] ?? null,
                'barangay' => $validated['barangay'] ?? null,
                'city' => $validated['city'] ?? null,
                'state' => $validated['state'] ?? null,
                'zip_code' => $validated['zip_code'] ?? null,
                'country' => $validated['country'] ?? null,
                'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
                'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
                'emergency_contact_relationship' => $validated['emergency_contact_relationship'] ?? null,
                'sss_number' => $validated['sss_number'] ?? null,
                'philhealth_number' => $validated['philhealth_number'] ?? null,
                'pagibig_number' => $validated['pagibig_number'] ?? null,
                'tin_number' => $validated['tin_number'] ?? null,
                'bio' => $validated['bio'] ?? null,
                'linkedin_url' => $validated['linkedin_url'] ?? null,
                'portfolio_url' => $validated['portfolio_url'] ?? null,
            ];

            if ($user->userInformation) {
                $user->userInformation->update($userInfoData);
            } else {
                UserInformation::create(array_merge($userInfoData, ['user_id' => $user->id]));
            }

            DB::commit();

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user->fresh(['userInformation'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload profile picture.
     */
    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => ['required', 'image', 'max:2048'], // 2MB max
        ]);

        $user = $request->user();

        // Ensure user has UserInformation record
        if (!$user->userInformation) {
            UserInformation::create(['user_id' => $user->id]);
            $user->load('userInformation');
        }

        // Delete old profile picture if exists
        if ($user->userInformation->profile_picture) {
            Storage::disk('public')->delete($user->userInformation->profile_picture);
        }

        // Store new profile picture
        $path = $request->file('profile_picture')->store('profile-pictures', 'public');

        $user->userInformation->update([
            'profile_picture' => $path
        ]);

        return response()->json([
            'message' => 'Profile picture uploaded successfully',
            'profile_picture' => $path,
            'url' => Storage::url($path)
        ]);
    }

    /**
     * Upload resume.
     */
    public function uploadResume(Request $request)
    {
        $request->validate([
            'resume' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:2048'], // 2MB max
        ]);

        $user = $request->user();

        // Ensure user has UserInformation record
        if (!$user->userInformation) {
            UserInformation::create(['user_id' => $user->id]);
            $user->load('userInformation');
        }

        // Delete old resume if exists
        if ($user->userInformation->resume_path) {
            Storage::disk('public')->delete($user->userInformation->resume_path);
        }

        // Store new resume
        $path = $request->file('resume')->store('resumes', 'public');

        $user->userInformation->update([
            'resume_path' => $path
        ]);

        return response()->json([
            'message' => 'Resume uploaded successfully',
            'resume_path' => $path,
            'url' => Storage::url($path)
        ]);
    }

    /**
     * Delete profile picture.
     */
    public function deleteProfilePicture(Request $request)
    {
        $user = $request->user();

        if ($user->userInformation && $user->userInformation->profile_picture) {
            Storage::disk('public')->delete($user->userInformation->profile_picture);
            $user->userInformation->update(['profile_picture' => null]);
        }

        return response()->json([
            'message' => 'Profile picture deleted successfully'
        ]);
    }

    /**
     * Quick setup for job application - phone and resume.
     */
    public function quickSetup(Request $request)
    {
        $request->validate([
            'phone' => ['required', 'string', 'max:20'],
            'resume' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'], // 5MB max
        ]);

        $user = $request->user();

        DB::beginTransaction();
        try {
            // Ensure user has UserInformation record
            if (!$user->userInformation) {
                UserInformation::create(['user_id' => $user->id]);
                $user->load('userInformation');
            }

            // Update phone number
            $user->userInformation->update([
                'phone' => $request->phone
            ]);

            // Handle resume upload
            if ($request->hasFile('resume')) {
                // Delete old resume if exists
                if ($user->userInformation->resume_path) {
                    Storage::disk('public')->delete($user->userInformation->resume_path);
                }

                // Store new resume in user_information
                $resumePath = $request->file('resume')->store('resumes', 'public');
                $user->userInformation->update([
                    'resume_path' => $resumePath
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Profile setup completed successfully',
                'user' => $user->fresh(['userInformation'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to complete profile setup',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete resume.
     */
    public function deleteResume(Request $request)
    {
        $user = $request->user();

        if ($user->userInformation && $user->userInformation->resume_path) {
            Storage::disk('public')->delete($user->userInformation->resume_path);
            $user->userInformation->update(['resume_path' => null]);
        }

        return response()->json([
            'message' => 'Resume deleted successfully'
        ]);
    }
}

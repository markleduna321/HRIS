<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\EmployeeDocumentController;
use App\Http\Controllers\Api\JobPostingController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\JobRequisitionController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\JobApplicationDocumentController;
use App\Http\Controllers\Api\WorkExperienceController;
use App\Http\Controllers\Api\SkillController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {
    // Users API
    Route::apiResource('users', UserController::class);
    Route::patch('users/{user}/activate', [UserController::class, 'activate']);
    Route::patch('users/{user}/deactivate', [UserController::class, 'deactivate']);
    Route::post('users/{user}/roles', [UserController::class, 'assignRoles']);
    Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword']);
    
    // Roles & Permissions API (specific routes before resource routes)
    Route::get('permissions', [RoleController::class, 'permissions']);
    Route::get('roles/stats', [RoleController::class, 'stats']);
    Route::post('roles/{role}/permissions', [RoleController::class, 'assignPermissions']);
    Route::put('roles/{role}/permissions', [RoleController::class, 'syncPermissions']);
    Route::get('roles/{role}/users', [RoleController::class, 'users']);
    Route::apiResource('roles', RoleController::class);
    
    // Employees API
    Route::apiResource('employees', EmployeeController::class);
    
    // Employee Documents API (201 Files)
    Route::get('employee-documents/document-types', [EmployeeDocumentController::class, 'documentTypes']);
    Route::get('employee-documents/{id}/download', [EmployeeDocumentController::class, 'download']);
    Route::apiResource('employee-documents', EmployeeDocumentController::class);
    
    // Departments API
    Route::apiResource('departments', DepartmentController::class);
    
    // Job Postings API
    Route::apiResource('job-postings', JobPostingController::class);
    
    // Job Requisitions API
    Route::get('job-requisitions/statistics', [JobRequisitionController::class, 'statistics']);    Route::get('job-requisitions/unfilled', [JobRequisitionController::class, 'getUnfilledRequisitions']);    Route::get('job-requisitions/existing-positions', [JobRequisitionController::class, 'getExistingPositions']);
    Route::post('job-requisitions/{jobRequisition}/approve', [JobRequisitionController::class, 'approve']);
    Route::post('job-requisitions/{jobRequisition}/reject', [JobRequisitionController::class, 'reject']);
    Route::post('job-requisitions/{jobRequisition}/mark-in-progress', [JobRequisitionController::class, 'markInProgress']);
    Route::post('job-requisitions/{jobRequisition}/cancel', [JobRequisitionController::class, 'cancel']);
    Route::post('job-requisitions/{jobRequisition}/mark-viewed', [JobRequisitionController::class, 'markAsViewed']);
    Route::apiResource('job-requisitions', JobRequisitionController::class);
    
    // Job Applications API
    Route::apiResource('job-applications', JobApplicationController::class);
    
    // Interviews API
    Route::apiResource('interviews', InterviewController::class);
    
    // Job Application Documents API (Pre-Employment)
    Route::post('job-application-documents/{jobApplicationDocument}/approve', [JobApplicationDocumentController::class, 'approve']);
    Route::post('job-application-documents/{jobApplicationDocument}/reject', [JobApplicationDocumentController::class, 'reject']);
    Route::apiResource('job-application-documents', JobApplicationDocumentController::class)->except(['update', 'show']);
    
    // Profile API
    Route::get('user/profile', function (Request $request) {
        return $request->user()->load('userInformation');
    });
    Route::put('profile', [App\Http\Controllers\ProfileController::class, 'update']);
    Route::post('profile/picture', [App\Http\Controllers\ProfileController::class, 'uploadProfilePicture']);
    Route::delete('profile/picture', [App\Http\Controllers\ProfileController::class, 'deleteProfilePicture']);
    Route::post('profile/resume', [App\Http\Controllers\ProfileController::class, 'uploadResume']);
    Route::delete('profile/resume', [App\Http\Controllers\ProfileController::class, 'deleteResume']);
    Route::post('user/profile/quick-setup', [App\Http\Controllers\ProfileController::class, 'quickSetup']);
    
    // Work Experiences API
    Route::apiResource('work-experiences', WorkExperienceController::class);
    
    // Skills API
    Route::get('skills', [SkillController::class, 'index']);
    Route::get('skills/user', [SkillController::class, 'userSkills']);
    Route::post('skills/sync', [SkillController::class, 'syncSkills']);
    Route::post('skills/add', [SkillController::class, 'addSkill']);
    Route::delete('skills/{skill}/remove', [SkillController::class, 'removeSkill']);
});

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
    
    // Job Applications API
    Route::apiResource('job-applications', JobApplicationController::class);
    
    // Profile API
    Route::put('profile', [App\Http\Controllers\ProfileController::class, 'update']);
    Route::post('profile/picture', [App\Http\Controllers\ProfileController::class, 'uploadProfilePicture']);
    Route::delete('profile/picture', [App\Http\Controllers\ProfileController::class, 'deleteProfilePicture']);
    Route::post('profile/resume', [App\Http\Controllers\ProfileController::class, 'uploadResume']);
    Route::delete('profile/resume', [App\Http\Controllers\ProfileController::class, 'deleteResume']);
});

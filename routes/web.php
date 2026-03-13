<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\EmployeeController;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/dashboard');
    }
    return redirect('/login');
});

Route::get('/login', function () {
    return Inertia::render('login/page');
})->middleware('guest')->name('login');

Route::get('/register', function () {
    return Inertia::render('register/page');
})->middleware('guest')->name('register');

// Protected routes (all authenticated users)
Route::middleware(['auth'])->group(function () {
    // Password change routes (accessible without password.changed middleware)
    Route::get('/password/change', function () {
        return Inertia::render('password/change');
    })->name('password.change');
    
    Route::post('/password/update', function (\Illuminate\Http\Request $request) {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        // Verify current password
        if (!\Illuminate\Support\Facades\Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'The provided password does not match your current password.']);
        }

        // Update password and mark as changed
        $user->update([
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'password_changed_at' => now(),
        ]);

        return redirect()->route('dashboard')->with('success', 'Password changed successfully!');
    })->name('password.update');
});

// Protected routes requiring password change
Route::middleware(['auth', 'password.changed'])->group(function () {
    // Main Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard/page');
    })->name('dashboard');

    // Job Board (accessible to all authenticated users)
    Route::get('/job-board', function () {
        return Inertia::render('job-board/page');
    })->middleware('permission:view job board')->name('job-board');

    // HRIS Module Routes (permission protected)
    // Employee Management
    Route::middleware(['permission:view employees'])->group(function () {
        Route::get('/employees', [EmployeeController::class, 'index'])->name('employees');
    });
    
    Route::middleware(['permission:create employees'])->group(function () {
        Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
    });
    
    Route::middleware(['permission:edit employees'])->group(function () {
        Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
    });
    
    Route::middleware(['permission:delete employees'])->group(function () {
        Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
    });

    // Employee Documents (201 Files)
    Route::middleware(['permission:view employees'])->group(function () {
        Route::get('/employee-documents', function () {
            return Inertia::render('employee-documents/page');
        })->name('employee-documents');
    });

    Route::get('/departments', function () {
        return Inertia::render('departments/page');
    })->middleware('permission:view departments')->name('departments');

    Route::get('/attendance', function () {
        return Inertia::render('attendance/page');
    })->middleware('permission:view attendance')->name('attendance');

    Route::get('/leaves', function () {
        return Inertia::render('leaves/page');
    })->middleware('permission:view leaves')->name('leaves');

    Route::get('/payroll', function () {
        return Inertia::render('payroll/page');
    })->middleware('permission:view payroll')->name('payroll');

    Route::get('/performance', function () {
        return Inertia::render('performance/page');
    })->middleware('permission:view performance')->name('performance');

    // RBAC Management Routes (permission protected)
    Route::middleware(['permission:view users'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
    });
    
    Route::middleware(['permission:create users'])->group(function () {
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
    });
    
    Route::middleware(['permission:edit users'])->group(function () {
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole'])->name('users.assign-role');
        Route::post('/users/{user}/remove-role', [UserController::class, 'removeRole'])->name('users.remove-role');
        Route::post('/users/{user}/give-permission', [UserController::class, 'givePermission'])->name('users.give-permission');
        Route::post('/users/{user}/revoke-permission', [UserController::class, 'revokePermission'])->name('users.revoke-permission');
    });
    
    Route::middleware(['permission:delete users'])->group(function () {
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });

    // Role Management
    Route::middleware(['permission:view roles'])->group(function () {
        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    });
    
    Route::middleware(['permission:create roles'])->group(function () {
        Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    });
    
    Route::middleware(['permission:edit roles'])->group(function () {
        Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::post('/roles/{role}/give-permission', [RoleController::class, 'givePermission'])->name('roles.give-permission');
        Route::post('/roles/{role}/revoke-permission', [RoleController::class, 'revokePermission'])->name('roles.revoke-permission');
    });
    
    Route::middleware(['permission:delete roles'])->group(function () {
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
    });

    // Permission Management
    Route::middleware(['permission:view permissions'])->group(function () {
        Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
    });
    
    Route::middleware(['permission:create permissions'])->group(function () {
        Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store');
    });
    
    Route::middleware(['permission:edit permissions'])->group(function () {
        Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update');
    });
    
    Route::middleware(['permission:delete permissions'])->group(function () {
        Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
    });
});

require __DIR__.'/auth.php';

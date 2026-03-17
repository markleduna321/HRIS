<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        // Basic Employee Info
        'employee_number',
        'user_id',
        'department_id',
        'position',
        
        // Employment Information
        'date_hired',
        'employment_status',
        'employment_type',
        'work_schedule',
        'basic_salary',
        'immediate_supervisor_id',
        'regularization_date',
        'resignation_date',
        'resignation_reason',
        
        // Employment-specific Notes
        'notes',
    ];

    protected $casts = [
        'date_hired' => 'date',
        'regularization_date' => 'date',
        'resignation_date' => 'date',
        'basic_salary' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function userInformation()
    {
        return $this->hasOne(UserInformation::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function leaves()
    {
        return $this->hasMany(Leave::class);
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }

    public function performances()
    {
        return $this->hasMany(Performance::class);
    }

    public function documents()
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    public function supervisor()
    {
        return $this->belongsTo(Employee::class, 'immediate_supervisor_id');
    }

    public function subordinates()
    {
        return $this->hasMany(Employee::class, 'immediate_supervisor_id');
    }

    public function getFullNameAttribute()
    {
        if ($this->userInformation) {
            return $this->userInformation->full_name;
        }
        if ($this->user) {
            return trim($this->user->first_name . ' ' . $this->user->last_name);
        }
        return '';
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_number', 'user_id', 'department_id', 'position',
        'first_name', 'middle_name', 'last_name',
        'gender', 'date_of_birth',
        'email', 'phone',
        'address', 'city', 'state', 'zip_code', 'country',
        'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
        'date_hired', 'employment_status',
        'sss_number', 'philhealth_number', 'pagibig_number', 'tin_number'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_hired' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
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

    public function getFullNameAttribute()
    {
        $name = $this->first_name . ' ';
        if ($this->middle_name) {
            $name .= substr($this->middle_name, 0, 1) . '. ';
        }
        $name .= $this->last_name;
        return $name;
    }
}

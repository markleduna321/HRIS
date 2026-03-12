<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'date', 'time_in', 'time_out', 'hours_worked',
        'overtime_hours', 'late_minutes', 'undertime_minutes', 'status', 'remarks'
    ];

    protected $casts = [
        'date' => 'date', 'hours_worked' => 'decimal:2', 'overtime_hours' => 'decimal:2',
    ];

    const STATUS_PRESENT = 'present';
    const STATUS_ABSENT = 'absent';
    const STATUS_ON_LEAVE = 'on_leave';

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}

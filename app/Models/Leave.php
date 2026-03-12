<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'leave_type', 'start_date', 'end_date', 'days_count',
        'reason', 'status', 'approved_by', 'approved_at', 'remarks'
    ];

    protected $casts = [
        'start_date' => 'date', 'end_date' => 'date',
        'approved_at' => 'datetime', 'days_count' => 'decimal:1',
    ];

    const TYPE_SICK = 'sick';
    const TYPE_VACATION = 'vacation';
    const TYPE_MATERNITY = 'maternity';
    const TYPE_PATERNITY = 'paternity';
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}

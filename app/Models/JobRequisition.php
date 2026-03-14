<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobRequisition extends Model
{
    protected $fillable = [
        'requisition_number',
        'position_type',
        'existing_job_posting_id',
        'position_title',
        'department_id',
        'location',
        'employment_type',
        'number_of_positions',
        'priority',
        'salary_range',
        'target_start_date',
        'justification',
        'required_qualifications',
        'key_responsibilities',
        'status',
        'positions_filled',
        'is_new',
        'requested_by',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected $casts = [
        'target_start_date' => 'date',
        'approved_at' => 'datetime',
        'is_new' => 'boolean',
        'number_of_positions' => 'integer',
        'positions_filled' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($requisition) {
            if (empty($requisition->requisition_number)) {
                $requisition->requisition_number = static::generateRequisitionNumber();
            }
        });
    }

    /**
     * Generate unique requisition number (REQ-YYYY-XXX)
     */
    public static function generateRequisitionNumber(): string
    {
        $year = date('Y');
        $prefix = "REQ-{$year}-";
        
        $lastRequisition = static::where('requisition_number', 'like', $prefix . '%')
            ->orderBy('requisition_number', 'desc')
            ->first();
        
        if ($lastRequisition) {
            $lastNumber = (int) substr($lastRequisition->requisition_number, -3);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        return $prefix . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function existingJobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class, 'existing_job_posting_id');
    }

    public function jobPostings(): HasMany
    {
        return $this->hasMany(JobPosting::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeByStatus($query, $status)
    {
        if (!empty($status)) {
            return $query->where('status', $status);
        }
        return $query;
    }

    public function scopeByPriority($query, $priority)
    {
        if (!empty($priority)) {
            return $query->where('priority', $priority);
        }
        return $query;
    }
}

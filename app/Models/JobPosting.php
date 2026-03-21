<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobPosting extends Model
{
    protected $fillable = [
        'job_requisition_id',
        'title',
        'department_id',
        'location',
        'employment_type',
        'description',
        'requirements',
        'responsibilities',
        'required_documents',
        'salary_min',
        'salary_max',
        'status',
        'closing_date',
        'positions_available',
        'target_audience',
        'posted_by',
    ];

    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'closing_date' => 'date',
        'required_documents' => 'array',
    ];

    public function jobRequisition(): BelongsTo
    {
        return $this->belongsTo(JobRequisition::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function postedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function scopeOpen($query)
    {
        return $query->where('status', 'open')
            ->where(function($q) {
                $q->whereNull('closing_date')
                  ->orWhereDate('closing_date', '>=', now());
            });
    }
}

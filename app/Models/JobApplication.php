<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobApplication extends Model
{
    protected $fillable = [
        'job_posting_id',
        'user_id',
        'applicant_name',
        'email',
        'phone',
        'address',
        'resume_path',
        'cover_letter_path',
        'cover_letter_text',
        'status',
        'notes',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }
}

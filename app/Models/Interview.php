<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
    protected $fillable = [
        'job_application_id',
        'type',
        'mode',
        'interview_date',
        'interview_time',
        'meeting_link',
        'location',
        'notes',
        'status',
        'scheduled_by',
    ];

    protected $casts = [
        'interview_date' => 'date',
    ];

    public function jobApplication()
    {
        return $this->belongsTo(JobApplication::class);
    }

    public function scheduledBy()
    {
        return $this->belongsTo(User::class, 'scheduled_by');
    }
}

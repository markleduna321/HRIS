<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkExperience extends Model
{
    protected $fillable = [
        'user_id',
        'position_title',
        'company_name',
        'start_date',
        'end_date',
        'currently_working',
        'job_description',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'currently_working' => 'boolean',
    ];

    /**
     * Get the user that owns the work experience.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

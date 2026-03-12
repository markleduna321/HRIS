<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Performance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'evaluator_id', 'review_period_start', 'review_period_end',
        'quality_of_work', 'productivity', 'dependability', 'initiative',
        'teamwork', 'communication', 'overall_rating', 'strengths',
        'areas_for_improvement', 'goals', 'status', 'submitted_at', 'evaluated_at'
    ];

    protected $casts = [
        'review_period_start' => 'date', 'review_period_end' => 'date',
        'overall_rating' => 'decimal:2', 'submitted_at' => 'datetime', 'evaluated_at' => 'datetime',
    ];

    const STATUS_DRAFT = 'draft';
    const STATUS_COMPLETED = 'completed';

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }
}

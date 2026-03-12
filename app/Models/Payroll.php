<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'payroll_period_start', 'payroll_period_end',
        'basic_salary', 'overtime_pay', 'allowances', 'bonuses', 'gross_pay',
        'sss_contribution', 'philhealth_contribution', 'pagibig_contribution',
        'withholding_tax', 'other_deductions', 'total_deductions', 'net_pay',
        'status', 'generated_by', 'approved_by', 'paid_at'
    ];

    protected $casts = [
        'payroll_period_start' => 'date', 'payroll_period_end' => 'date',
        'basic_salary' => 'decimal:2', 'gross_pay' => 'decimal:2', 'net_pay' => 'decimal:2',
        'sss_contribution' => 'decimal:2', 'philhealth_contribution' => 'decimal:2',
        'pagibig_contribution' => 'decimal:2', 'withholding_tax' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    const STATUS_DRAFT = 'draft';
    const STATUS_APPROVED = 'approved';
    const STATUS_PAID = 'paid';

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function generator()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}

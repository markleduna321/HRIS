<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->date('payroll_period_start');
            $table->date('payroll_period_end');
            
            // Earnings
            $table->decimal('basic_salary', 10, 2);
            $table->decimal('overtime_pay', 10, 2)->default(0);
            $table->decimal('allowances', 10, 2)->default(0);
            $table->decimal('bonuses', 10, 2)->default(0);
            $table->decimal('gross_pay', 10, 2);
            
            // Philippine Deductions
            $table->decimal('sss_contribution', 10, 2)->default(0);
            $table->decimal('philhealth_contribution', 10, 2)->default(0);
            $table->decimal('pagibig_contribution', 10, 2)->default(0);
            $table->decimal('withholding_tax', 10, 2)->default(0);
            $table->decimal('other_deductions', 10, 2)->default(0);
            $table->decimal('total_deductions', 10, 2);
            
            // Net Pay
            $table->decimal('net_pay', 10, 2);
            
            $table->enum('status', ['draft', 'pending', 'approved', 'paid'])->default('draft');
            $table->foreignId('generated_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};

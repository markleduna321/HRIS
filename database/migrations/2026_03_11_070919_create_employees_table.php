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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->constrained();
            $table->string('position');
            
            // Employment Information Only (personal info in user_information table)
            $table->date('date_hired');
            $table->enum('employment_status', ['probationary', 'regular', 'contractual', 'resigned', 'terminated'])->default('probationary');
            $table->enum('employment_type', ['full-time', 'part-time', 'contractual'])->default('full-time');
            $table->string('work_schedule')->nullable(); // day shift, night shift, flexible
            $table->decimal('basic_salary', 10, 2);
            $table->foreignId('immediate_supervisor_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->date('regularization_date')->nullable();
            $table->date('resignation_date')->nullable();
            $table->text('resignation_reason')->nullable();
            $table->text('notes')->nullable(); // Employment-specific notes
            
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};

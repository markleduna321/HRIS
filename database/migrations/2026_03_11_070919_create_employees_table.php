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
            
            // Personal Information
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('civil_status', ['single', 'married', 'widowed', 'separated'])->nullable();
            $table->string('nationality')->default('Filipino');
            
            // Contact Information
            $table->string('email')->unique();
            $table->string('mobile_number');
            $table->string('telephone_number')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('zip_code')->nullable();
            
            // Emergency Contact
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_number')->nullable();
            $table->string('emergency_contact_relationship')->nullable();
            
            // Employment Information
            $table->date('date_hired');
            $table->enum('employment_status', ['probationary', 'regular', 'contractual', 'resigned', 'terminated'])->default('probationary');
            $table->enum('employment_type', ['full-time', 'part-time', 'contractual'])->default('full-time');
            $table->decimal('basic_salary', 10, 2);
            
            // Government IDs
            $table->string('sss_number')->nullable();
            $table->string('philhealth_number')->nullable();
            $table->string('pagibig_number')->nullable();
            $table->string('tin_number')->nullable();
            
            $table->enum('status', ['active', 'inactive'])->default('active');
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

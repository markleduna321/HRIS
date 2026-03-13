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
        Schema::create('user_information', function (Blueprint $table) {
            $table->id();
            
            // Foreign Keys - Can link to either user or employee or both
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('employee_id')->nullable()->constrained()->onDelete('cascade');
            
            // Basic Personal Information
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('suffix')->nullable(); // Jr., Sr., III, etc.
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->enum('civil_status', ['single', 'married', 'widowed', 'separated', 'divorced'])->nullable();
            $table->string('nationality')->nullable()->default('Filipino');
            $table->string('religion')->nullable();
            $table->string('blood_type')->nullable(); // A+, B+, O+, AB+, A-, B-, O-, AB-
            $table->decimal('height', 5, 2)->nullable(); // in cm
            $table->decimal('weight', 5, 2)->nullable(); // in kg
            
            // Contact Information
            $table->string('email')->nullable()->unique();
            $table->string('personal_email')->nullable();
            $table->string('phone')->nullable();
            $table->string('alternate_mobile')->nullable();
            $table->string('telephone_number')->nullable();
            
            // Current Address
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable(); // Province/State
            $table->string('zip_code')->nullable();
            $table->string('country')->nullable()->default('Philippines');
            
            // Permanent Address
            $table->text('permanent_address')->nullable();
            $table->string('permanent_city')->nullable();
            $table->string('permanent_state')->nullable();
            $table->string('permanent_zip_code')->nullable();
            $table->string('permanent_country')->nullable()->default('Philippines');
            
            // Emergency Contact
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relationship')->nullable();
            $table->text('emergency_contact_address')->nullable();
            
            // Spouse Information (if married)
            $table->string('spouse_name')->nullable();
            $table->string('spouse_occupation')->nullable();
            $table->string('spouse_employer')->nullable();
            $table->string('spouse_contact_number')->nullable();
            $table->integer('number_of_children')->default(0);
            
            // Government IDs
            $table->string('sss_number')->nullable()->unique();
            $table->string('philhealth_number')->nullable()->unique();
            $table->string('pagibig_number')->nullable()->unique();
            $table->string('tin_number')->nullable()->unique();
            $table->string('drivers_license')->nullable();
            $table->string('passport_number')->nullable();
            $table->string('voters_id')->nullable();
            
            // Bank Information
            $table->string('bank_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('bank_account_name')->nullable();
            
            // Beneficiary Information
            $table->string('beneficiary_name')->nullable();
            $table->string('beneficiary_relationship')->nullable();
            $table->string('beneficiary_contact')->nullable();
            $table->text('beneficiary_address')->nullable();
            
            // Education Background
            $table->string('highest_education')->nullable(); // Elementary, High School, College, Vocational, Masters, Doctorate
            $table->string('school_name')->nullable();
            $table->string('course_degree')->nullable();
            $table->integer('year_graduated')->nullable();
            
            // Skills and Certifications
            $table->json('skills')->nullable(); // Array of skills
            $table->json('certifications')->nullable(); // Array of certifications  
            $table->json('languages')->nullable(); // Array of languages
            
            // Previous Employment
            $table->string('previous_employer')->nullable();
            $table->string('previous_position')->nullable();
            $table->date('previous_employment_from')->nullable();
            $table->date('previous_employment_to')->nullable();
            $table->text('previous_responsibilities')->nullable();
            
            // Character References
            $table->string('reference1_name')->nullable();
            $table->string('reference1_position')->nullable();
            $table->string('reference1_company')->nullable();
            $table->string('reference1_contact')->nullable();
            
            $table->string('reference2_name')->nullable();
            $table->string('reference2_position')->nullable();
            $table->string('reference2_company')->nullable();
            $table->string('reference2_contact')->nullable();
            
            // Photos and Documents
            $table->string('profile_picture')->nullable();
            $table->string('resume_path')->nullable();
            
            // Social Media / Professional Links
            $table->string('linkedin_url')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->string('facebook_url')->nullable();
            
            // Tax Information
            $table->string('tax_status')->nullable(); // Single, Married, Head of Family
            $table->integer('number_of_dependents')->default(0);
            
            // Additional Information
            $table->text('bio')->nullable();
            $table->text('notes')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for performance
            $table->index('email');
            $table->index(['user_id', 'employee_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_information');
    }
};

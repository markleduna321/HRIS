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
        Schema::create('job_requisitions', function (Blueprint $table) {
            $table->id();
            $table->string('requisition_number')->unique(); // REQ-2024-004
            $table->enum('position_type', ['new', 'existing'])->default('new'); // New Position or Existing Position
            $table->foreignId('existing_job_posting_id')->nullable()->constrained('job_postings')->nullOnDelete(); // If type is existing
            
            // Position Details
            $table->string('position_title');
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->string('location')->nullable();
            $table->enum('employment_type', ['full-time', 'part-time', 'contract', 'internship'])->default('full-time');
            $table->integer('number_of_positions')->default(1);
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->string('salary_range')->nullable(); // e.g., "₱50,000 - ₱70,000"
            $table->date('target_start_date')->nullable();
            
            // Business Justification
            $table->text('justification')->nullable();
            
            // Position Requirements
            $table->text('required_qualifications')->nullable();
            $table->text('key_responsibilities')->nullable();
            
            // Status and tracking
            $table->enum('status', ['pending', 'approved', 'rejected', 'in_progress', 'filled', 'cancelled'])->default('pending');
            $table->integer('positions_filled')->default(0);
            $table->boolean('is_new')->default(true); // For "New" badge
            
            // Metadata
            $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('status');
            $table->index('priority');
            $table->index('requested_by');
        });
        
        // Add optional requisition reference to job_postings table
        Schema::table('job_postings', function (Blueprint $table) {
            $table->foreignId('job_requisition_id')->nullable()->after('id')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_postings', function (Blueprint $table) {
            $table->dropForeign(['job_requisition_id']);
            $table->dropColumn('job_requisition_id');
        });
        
        Schema::dropIfExists('job_requisitions');
    }
};

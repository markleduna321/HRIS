<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_application_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_application_id')->constrained()->cascadeOnDelete();
            $table->enum('document_type', [
                'nbi_clearance',
                'police_clearance',
                'barangay_clearance',
                'medical_certificate',
                'birth_certificate',
                'valid_id',
                'sss_form',
                'philhealth_form',
                'pagibig_form',
                'tin_id',
                'certificate_of_employment',
                'diploma',
                'transcript_of_records',
                'other'
            ]);
            $table->string('file_path');
            $table->string('original_filename')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_application_documents');
    }
};

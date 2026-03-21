<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change document_type from ENUM to VARCHAR to support dynamic document types
        DB::statement('ALTER TABLE job_application_documents MODIFY COLUMN document_type VARCHAR(255) NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to ENUM with original values
        DB::statement("ALTER TABLE job_application_documents MODIFY COLUMN document_type ENUM(
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
        ) NOT NULL");
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE job_applications MODIFY COLUMN status ENUM('pending','reviewing','interview','shortlisted','final_interview','job_offer','accepted','hired','rejected') DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE job_applications MODIFY COLUMN status ENUM('pending','reviewing','shortlisted','interview','rejected','accepted') DEFAULT 'pending'");
    }
};

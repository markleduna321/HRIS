<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_application_id')->constrained()->cascadeOnDelete();
            $table->enum('mode', ['online', 'in-person']);
            $table->date('interview_date');
            $table->time('interview_time');
            $table->string('meeting_link')->nullable();
            $table->string('location')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['scheduled', 'completed', 'cancelled', 'no-show'])->default('scheduled');
            $table->foreignId('scheduled_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};

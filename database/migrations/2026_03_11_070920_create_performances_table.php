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
        Schema::create('performances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('evaluator_id')->constrained('users');
            $table->date('review_period_start');
            $table->date('review_period_end');
            
            // Rating Criteria (1-5 scale)
            $table->integer('quality_of_work')->nullable();
            $table->integer('productivity')->nullable();
            $table->integer('dependability')->nullable();
            $table->integer('initiative')->nullable();
            $table->integer('teamwork')->nullable();
            $table->integer('communication')->nullable();
            $table->decimal('overall_rating', 3, 2)->nullable();
            
            // Comments
            $table->text('strengths')->nullable();
            $table->text('areas_for_improvement')->nullable();
            $table->text('goals')->nullable();
            
            $table->enum('status', ['draft', 'submitted', 'completed'])->default('draft');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('evaluated_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('performances');
    }
};

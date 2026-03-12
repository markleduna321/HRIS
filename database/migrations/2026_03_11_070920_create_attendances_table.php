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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->time('time_in')->nullable();
            $table->time('time_out')->nullable();
            $table->decimal('hours_worked', 4, 2)->default(0);
            $table->decimal('overtime_hours', 4, 2)->default(0);
            $table->integer('late_minutes')->default(0);
            $table->integer('undertime_minutes')->default(0);
            $table->enum('status', ['present', 'absent', 'late', 'halfday', 'on_leave'])->default('present');
            $table->text('remarks')->nullable();
            $table->timestamps();
            
            $table->unique(['employee_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};

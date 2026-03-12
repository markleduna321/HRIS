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
        // Check if columns need to be renamed (in case migration was partially run)
        $columns = Schema::getColumnListing('employees');
        
        if (in_array('mobile_number', $columns)) {
            Schema::table('employees', function (Blueprint $table) {
                $table->renameColumn('mobile_number', 'phone');
            });
        }
        
        if (in_array('province', $columns)) {
            Schema::table('employees', function (Blueprint $table) {
                $table->renameColumn('province', 'state');
            });
        }
        
        if (in_array('emergency_contact_number', $columns)) {
            Schema::table('employees', function (Blueprint $table) {
                $table->renameColumn('emergency_contact_number', 'emergency_contact_phone');
            });
        }

        // Add new column if it doesn't exist
        if (!in_array('country', $columns)) {
            Schema::table('employees', function (Blueprint $table) {
                $table->string('country')->default('Philippines')->after('zip_code');
            });
        }

        // Convert employment_status to varchar if it's still enum, then update data
        DB::statement("ALTER TABLE employees MODIFY COLUMN employment_status VARCHAR(255)");
        DB::statement("ALTER TABLE employees MODIFY COLUMN gender VARCHAR(255)");

        // Update existing data to match new enum values
        DB::table('employees')->where('employment_status', 'probationary')->update(['employment_status' => 'active']);
        DB::table('employees')->where('employment_status', 'regular')->update(['employment_status' => 'active']);
        DB::table('employees')->where('employment_status', 'contractual')->update(['employment_status' => 'active']);

        // Update enum columns with new values
        DB::statement("ALTER TABLE employees MODIFY COLUMN gender ENUM('male', 'female', 'other') NULL");
        DB::statement("ALTER TABLE employees MODIFY COLUMN employment_status ENUM('active', 'on_leave', 'resigned', 'terminated') DEFAULT 'active'");

        // Drop unused columns
        $columnsToDrop = ['suffix', 'civil_status', 'nationality', 'telephone_number', 'employment_type', 'basic_salary', 'status'];
        $existingColumns = array_intersect($columnsToDrop, $columns);
        
        if (!empty($existingColumns)) {
            Schema::table('employees', function (Blueprint $table) use ($existingColumns) {
                $table->dropColumn($existingColumns);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add back dropped columns
        Schema::table('employees', function (Blueprint $table) {
            $table->string('suffix')->nullable();
            $table->enum('civil_status', ['single', 'married', 'widowed', 'separated'])->nullable();
            $table->string('nationality')->default('Filipino');
            $table->string('telephone_number')->nullable();
            $table->enum('employment_type', ['full-time', 'part-time', 'contractual'])->default('full-time');
            $table->decimal('basic_salary', 10, 2);
            $table->enum('status', ['active', 'inactive'])->default('active');
        });

        // Revert enum columns
        DB::statement("ALTER TABLE employees MODIFY COLUMN gender ENUM('male', 'female') NULL");
        DB::statement("ALTER TABLE employees MODIFY COLUMN employment_status ENUM('probationary', 'regular', 'contractual', 'resigned', 'terminated') DEFAULT 'probationary'");

        // Drop added column
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn('country');
        });

        // Rename columns back
        Schema::table('employees', function (Blueprint $table) {
            $table->renameColumn('phone', 'mobile_number');
            $table->renameColumn('state', 'province');
            $table->renameColumn('emergency_contact_phone', 'emergency_contact_number');
        });
    }
};

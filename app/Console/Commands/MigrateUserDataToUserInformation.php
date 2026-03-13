<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Employee;
use App\Models\UserInformation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateUserDataToUserInformation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'data:migrate-user-information';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate existing user and employee data to user_information table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting data migration to user_information table...');

        DB::beginTransaction();

        try {
            // Step 1: Migrate user data to user_information
            $this->info('Step 1: Migrating user data...');
            $usersCount = 0;

            User::chunk(100, function ($users) use (&$usersCount) {
                foreach ($users as $user) {
                    // Check if user_information already exists
                    $existingUserInfo = UserInformation::where('user_id', $user->id)->first();

                    if (!$existingUserInfo) {
                        // Prepare data array with only non-null values
                        $data = [
                            'user_id' => $user->id,
                        ];

                        // Add fields only if they have values
                        if ($user->first_name) $data['first_name'] = $user->first_name;
                        if ($user->last_name) $data['last_name'] = $user->last_name;
                        if ($user->email) $data['email'] = $user->email;
                        if ($user->phone) $data['phone'] = $user->phone;
                        if ($user->address) $data['address'] = $user->address;
                        if ($user->bio) $data['bio'] = $user->bio;
                        if ($user->date_of_birth) $data['date_of_birth'] = $user->date_of_birth;
                        if ($user->profile_picture) $data['profile_picture'] = $user->profile_picture;
                        if ($user->resume_path) $data['resume_path'] = $user->resume_path;
                        if ($user->linkedin_url) $data['linkedin_url'] = $user->linkedin_url;
                        if ($user->portfolio_url) $data['portfolio_url'] = $user->portfolio_url;

                        UserInformation::create($data);
                        $usersCount++;
                    }
                }
            });

            $this->info("✓ Migrated {$usersCount} user records to user_information");

            // Step 2: Link employees to user_information
            $this->info('Step 2: Linking employees to user_information...');
            $employeesCount = 0;

            Employee::chunk(100, function ($employees) use (&$employeesCount) {
                foreach ($employees as $employee) {
                    // Find user_information by user_id
                    $userInfo = UserInformation::where('user_id', $employee->user_id)->first();

                    if ($userInfo && !$userInfo->employee_id) {
                        $userInfo->update(['employee_id' => $employee->id]);
                        $employeesCount++;
                    }
                }
            });

            $this->info("✓ Linked {$employeesCount} employees to user_information");

            DB::commit();

            $this->info('');
            $this->info('✓ Data migration completed successfully!');
            $this->info('');
            $this->table(
                ['Action', 'Count'],
                [
                    ['Users migrated to user_information', $usersCount],
                    ['Employees linked to user_information', $employeesCount],
                ]
            );

            return Command::SUCCESS;

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Data migration failed: ' . $e->getMessage());
            $this->error($e->getTraceAsString());
            return Command::FAILURE;
        }
    }
}

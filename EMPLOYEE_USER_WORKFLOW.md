# Employee-User Auto-Creation Workflow

## Overview
This HRIS system implements a **unified workflow** where creating an employee automatically creates their user account for system access.

## ⚠️ Important: Seeder Configuration

**Do NOT use `WithoutModelEvents` trait in seeders** when you want the Observer to run. This trait disables all model events including observers.

```php
// ❌ WRONG - Observer won't run
class EmployeeSeeder extends Seeder
{
    use WithoutModelEvents;
    // ...
}

// ✅ CORRECT - Observer will run
class EmployeeSeeder extends Seeder
{
    // No WithoutModelEvents trait
    // ...
}
```

## How It Works

### 1. **Create an Employee → User Account Auto-Created**

When you create an employee:
```php
$employee = Employee::create([
    'employee_number' => 'EMP-001',
    'first_name' => 'Juan',
    'last_name' => 'Dela Cruz',
    'email' => 'juan.delacruz@company.com',
    'department_id' => 1,
    'position' => 'Developer',
    // ... other employee details
]);

// User account is automatically created!
// $employee->user is now available
```

### 2. **What Happens Automatically**

The `EmployeeObserver` handles:

- ✅ **User Creation**: Creates a User account with email and password
- ✅ **Role Assignment**: Assigns default 'employee' role
- ✅ **Default Password**: Sets password to `employee123` (should be changed on first login)
- ✅ **Email Generation**: If no email provided, generates from name (e.g., `juan.delacruz@company.com`)
- ✅ **User Linking**: Links User to Employee automatically

### 3. **User Updates**

When you update an employee:
```php
$employee->update([
    'first_name' => 'Maria',
    'email' => 'maria.santos@company.com'
]);

// User account name and email are automatically updated!
```

### 4. **User Deactivation**

When you delete/restore an employee:
```php
// Soft delete - deactivates user account
$employee->delete();

// Restore - reactivates user account  
$employee->restore();

// Force delete - permanently deletes user account
$employee->forceDelete();
```

## User Types

### Employees with User Accounts (Auto-created)
- All employees automatically get user accounts
- Can access the system to view payslips, request leaves, etc.
- Default role: `employee`
- Can be promoted to `manager` or `hr_manager` roles

### Admin Users (Manual)
- Created separately without employee records
- Full system access
- Role: `admin`

Example:
```php
$admin = User::create([
    'name' => 'System Admin',
    'email' => 'admin@hris.com',
    'password' => Hash::make('password'),
]);
$admin->assignRole('admin');
```

## Roles and Permissions

### Default Role Assignment
- New employees → `employee` role (via EmployeeObserver)
- Can be upgraded via User Management

### Available Roles
1. **admin** - Full system access
2. **hr_manager** - Manage employees, payroll, leaves, etc.
3. **manager** - Team management, approve leaves
4. **employee** - View own records, create leave requests

## Password Management

### Default Password
New employees get password: `employee123`

**TODO**: Implement email notification to send credentials

### Password Reset
Employees can reset password via:
- Forgot Password link on login page
- HR can manually reset via User Management

## Additional Features

### Manual User Creation (Optional)
If you need to create a user without an employee:
```php
$user = User::create([
    'name' => 'External Auditor',
    'email' => 'auditor@external.com',
    'password' => Hash::make('password'),
]);
$user->assignRole('auditor'); // custom role
```

### Assign Multiple Roles
```php
// Make an employee also an HR Manager
$employee->user->assignRole('hr_manager');

// Or sync roles
$employee->user->syncRoles(['employee', 'manager']);
```

### Check Permissions
```php
// In controllers
if ($user->can('edit employees')) {
    // Allow action
}

// In Blade/React
@can('view payroll')
    // Show payroll section
@endcan
```

## Testing

Run the seeder to see the workflow:
```bash
php artisan migrate:fresh --seed
```

This creates:
- 1 Admin user (no employee record)
- 3 Sample employees (with auto-created user accounts)
  - maria.cruz@company.com / employee123 (HR Manager)
  - juan.delacruz@company.com / employee123 (Developer)
  - ana.reyes@company.com / employee123 (Accountant)

## Implementation Files

- **Observer**: `app/Observers/EmployeeObserver.php`
- **Model**: `app/Models/Employee.php`
- **Seeder**: `database/seeders/EmployeeSeeder.php`
- **Registered**: `app/Providers/AppServiceProvider.php`

## Benefits

✅ **Simplified Workflow**: Create employee → User account ready  
✅ **Automatic Sync**: Update employee → User updated  
✅ **RBAC Ready**: Roles assigned automatically  
✅ **Deactivation**: Delete employee → User deactivated  
✅ **Data Integrity**: User-Employee relationship maintained  

## Future Enhancements

- [ ] Email notification with login credentials
- [ ] Force password change on first login
- [ ] Bulk employee import with auto-user creation
- [ ] Employee self-registration with approval workflow

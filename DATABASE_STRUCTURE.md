# HRIS Database Structure

## 3-Table Normalized Architecture

### Overview
The system uses a **normalized 3-table structure** to eliminate data redundancy and provide a single source of truth for personal information:

1. **Users Table**: Authentication credentials only
2. **User Information Table**: Personal/basic information (shared by users and employees)
3. **Employees Table**: Employment-specific data only

### Data Flow Architecture

```
┌──────────────────┐
│   USERS TABLE    │ (Authentication Only)
│                  │
│ - id             │
│ - email          │
│ - password       │
│ - is_active      │
│ - roles          │
└────────┬─────────┘
         │
         │ user_id (FK)
         ▼
┌──────────────────────┐
│ USER_INFORMATION     │ (Personal/Basic Info - Single Source of Truth)
│                      │
│ - user_id    ────────┼──→ users.id (nullable)
│ - employee_id────────┼──→ employees.id (nullable)
│                      │
│ Personal Info:       │
│ - first_name         │
│ - last_name          │
│ - phone              │
│ - address            │
│ - government IDs     │
│ - education          │
│ - skills/certs       │
│ - 100+ fields        │
└────────┬─────────────┘
         │ employee_id (FK)
         ▼
┌──────────────────┐
│ EMPLOYEES TABLE  │ (Employment-Specific Only)
│                  │
│ - id             │
│ - user_id        │
│ - employee_num   │
│ - department_id  │
│ - position       │
│ - date_hired     │
│ - basic_salary   │
│ - work_schedule  │
└──────────────────┘
```

### Use Cases

#### Applicant (User Only)
```
User (login credentials)
  ↓ user_id
UserInformation (personal profile)
```
- Creates account via registration
- Fills out profile with personal info
- Applies for jobs
- **No employee record** (not hired yet)

#### Employee (User + Employee + UserInformation)
```
User (login credentials)
  ↓ user_id
UserInformation (personal info)
  ↑ employee_id
Employee (employment data)
```
- Has user account (inherited from applicant or created directly)
- Personal info stored in user_information
- Employment data (position, salary, etc.) in employees table
- **All three tables linked**

## Table Specifications

### 1. Users Table (~8 fields)
**Purpose**: Authentication and account management ONLY

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| email | string (unique) | Login email |
| password | hashed | Login password |
| remember_token | string | Session token |
| email_verified_at | timestamp | Verification date |
| is_active | boolean | Account status |
| password_changed_at | timestamp | Last password change |
| created_at, updated_at | timestamps | Audit trail |

**Relationships**:
- `hasOne(UserInformation)` via user_id
- `hasOne(Employee)` via user_id
- `hasRoles()` (Spatie Permission)

---

### 2. User Information Table (~112 fields)
**Purpose**: All personal/basic information - shared by applicants and employees

**Foreign Keys**:
| Field | Type | Description |
|-------|------|-------------|
| user_id | bigint (nullable) | Link to users table |
| employee_id | bigint (nullable) | Link to employees table |

**Design Note**: Nullable FKs allow:
- Applicant only: user_id set, employee_id null
- Employee: both user_id and employee_id set
- Future flexibility: employee records without user accounts

#### Personal Information (14 fields)
- first_name, middle_name, last_name, suffix
- gender, date_of_birth, place_of_birth
- civil_status, nationality, religion, blood_type
- height (decimal), weight (decimal)

#### Contact Information (5 fields)
- email (unique)
- personal_email
- phone
- alternate_mobile
- telephone_number

#### Current Address (5 fields)
- address
- city
- state
- zip_code
- country

#### Permanent Address (5 fields)
- permanent_address
- permanent_city
- permanent_state
- permanent_zip_code
- permanent_country

#### Emergency Contact (4 fields)
- emergency_contact_name
- emergency_contact_phone
- emergency_contact_relationship
- emergency_contact_address

#### Spouse/Family Information (5 fields)
- spouse_name
- spouse_occupation
- spouse_employer
- spouse_contact_number
- number_of_children (integer)

#### Government IDs (7 fields - all unique)
- sss_number
- philhealth_number
- pagibig_number
- tin_number
- drivers_license
- passport_number
- voters_id

#### Bank Information (3 fields)
- bank_name
- bank_account_number
- bank_account_name

#### Beneficiary Information (4 fields)
- beneficiary_name
- beneficiary_relationship
- beneficiary_contact
- beneficiary_address

#### Education Background (4 fields)
- highest_education
- school_name
- course_degree
- year_graduated (integer)

#### Skills & Certifications (3 JSON arrays)
- skills (array)
- certifications (array)
- languages (array)

#### Previous Employment (5 fields)
- previous_employer
- previous_position
- previous_employment_from (date)
- previous_employment_to (date)
- previous_job_responsibilities (text)

#### Character References (8 fields - 2 references)
- character_reference_name_1, position_1, company_1, contact_1
- character_reference_name_2, position_2, company_2, contact_2

#### Photos/Documents (2 fields)
- profile_picture (path)
- resume_path (path)

#### Social Media (3 fields)
- linkedin_url
- portfolio_url
- facebook_url

#### Tax Information (2 fields)
- tax_status
- number_of_dependents (integer)

#### Additional Information (2 fields)
- bio (text)
- notes (text)

**Indexes**:
- Unique index on `email`
- Composite index on `(user_id, employee_id)`
- Foreign key indexes (user_id, employee_id)

**Relationships**:
- `belongsTo(User)` via user_id
- `belongsTo(Employee)` via employee_id

**Computed Attributes**:
- `full_name` → "First Middle Last Suffix"
- `full_address` → "Address, City, State ZIP, Country"
- `full_permanent_address` → Permanent address concatenation

---

### 3. Employees Table (~15 fields)
**Purpose**: Employment-specific data ONLY

#### Core Fields (5 fields)
- id (PK)
- employee_number (unique)
- user_id (FK to users - nullable)
- department_id (FK to departments)
- position

#### Employment Details (8 fields)
- date_hired (date)
- employment_status (enum: active, resigned, terminated, etc.)
- employment_type (enum: regular, contractual, probationary, etc.)
- work_schedule (enum: day shift, night shift, flexible, etc.)
- basic_salary (decimal)
- immediate_supervisor_id (FK to employees - nullable)
- regularization_date (date - nullable)

#### Resignation Info (2 fields)
- resignation_date (date - nullable)
- resignation_reason (text - nullable)

#### Additional (1 field)
- notes (text - employment-specific notes)

**Timestamps & Soft Deletes**:
- created_at, updated_at, deleted_at

**Relationships**:
- `belongsTo(User)` via user_id
- `hasOne(UserInformation)` via employee_id
- `belongsTo(Department)` via department_id
- `belongsTo(Employee, 'immediate_supervisor_id')` (supervisor)
- `hasMany(Employee, 'immediate_supervisor_id')` (subordinates)
- `hasMany(Leave)`
- `hasMany(Attendance)`
- `hasMany(Payroll)`
- `hasMany(Performance)`
- `hasMany(EmployeeDocument)`

**Computed Attributes**:
- `full_name` → delegates to `userInformation->full_name`

## Benefits of 3-Table Structure

### ✅ No Data Redundancy
- Personal information stored ONCE in user_information
- No duplicate name, address, ID fields across tables
- Single source of truth for personal data

### ✅ Clear Separation of Concerns
- **Users**: Authentication logic only
- **UserInformation**: Personal data only
- **Employees**: Employment data only

### ✅ Flexibility
- Applicants don't need employee records
- Employees can exist without user accounts (future: imported HR data)
- Easy to extend any table without affecting others

### ✅ Scalability
- Add personal fields → only update user_information table
- Add employment fields → only update employees table
- Add authentication features → only update users table

### ✅ DRY Principle
- Don't Repeat Yourself
- Name, address, IDs appear only once
- Easy to maintain and update

### ✅ Compliance & Reporting
- Government reports: query user_information for IDs, education
- Payroll: combine employees.basic_salary + user_information.bank_info
- 201 Files: join employees + user_information for complete profile

### ✅ Performance
- Indexed foreign keys for fast joins
- Normalized data reduces storage
- Efficient queries with proper eager loading

## Query Examples

### Get Complete Employee Profile
```php
$employee = Employee::with('userInformation', 'department', 'user')
    ->where('employee_number', 'EMP-2024-001')
    ->first();

// Access personal info
$name = $employee->userInformation->full_name;
$email = $employee->userInformation->email;
$phone = $employee->userInformation->phone;
$sss = $employee->userInformation->sss_number;

// Access employment info
$position = $employee->position;
$salary = $employee->basic_salary;
$hired = $employee->date_hired;

// Access auth info
$loginEmail = $employee->user->email;
$isActive = $employee->user->is_active;
```

### Get Applicant Profile
```php
$user = User::with('userInformation')->find($userId);

// Access personal info
$name = $user->userInformation->full_name;
$resume = $user->userInformation->resume_path;
$linkedin = $user->userInformation->linkedin_url;
$phone = $user->userInformation->phone;
```

### Convert Applicant to Employee
```php
// Applicant already has user + user_information
$user = User::with('userInformation')->find($applicantUserId);

// Create employee record
$employee = Employee::create([
    'user_id' => $user->id,
    'employee_number' => 'EMP-2026-001',
    'department_id' => 1,
    'position' => 'Software Developer',
    'date_hired' => now(),
    'employment_status' => 'probationary',
    'employment_type' => 'regular',
    'work_schedule' => 'day_shift',
    'basic_salary' => 30000.00,
]);

// Link user_information to employee
$user->userInformation->update([
    'employee_id' => $employee->id
]);

// Now the relationship is complete:
// User → UserInformation ← Employee
```

### Update Personal Information (applies to both applicants and employees)
```php
// Find user
$user = User::find($userId);

// Update user_information (single source of truth)
$user->userInformation->update([
    'phone' => '09171234567',
    'address' => '123 Main St',
    'city' => 'Manila',
    'sss_number' => '12-3456789-0',
]);

// If user is employee, changes reflect automatically
// If user is applicant, changes reflect in profile
```

### Update Employment Information (employees only)
```php
$employee = Employee::find($employeeId);

// Update employment-specific data
$employee->update([
    'position' => 'Senior Developer',
    'basic_salary' => 45000.00,
    'employment_status' => 'regular',
    'regularization_date' => now(),
]);

// Personal info stays in user_information (untouched)
```

### Get All Employees with Complete Data
```php
$employees = Employee::with(['userInformation', 'department', 'supervisor'])
    ->where('employment_status', 'active')
    ->get()
    ->map(function ($employee) {
        return [
            'employee_number' => $employee->employee_number,
            'full_name' => $employee->userInformation->full_name,
            'position' => $employee->position,
            'department' => $employee->department->name,
            'email' => $employee->userInformation->email,
            'phone' => $employee->userInformation->phone,
            'date_hired' => $employee->date_hired,
            'salary' => $employee->basic_salary,
            'supervisor' => $employee->supervisor?->userInformation->full_name,
        ];
    });
```

### Generate Payroll Report
```php
$payrollData = Employee::with('userInformation')
    ->where('employment_status', 'active')
    ->get()
    ->map(function ($employee) {
        return [
            'employee_number' => $employee->employee_number,
            'full_name' => $employee->userInformation->full_name,
            'basic_salary' => $employee->basic_salary,
            'bank_name' => $employee->userInformation->bank_name,
            'account_number' => $employee->userInformation->bank_account_number,
            'sss_number' => $employee->userInformation->sss_number,
            'philhealth_number' => $employee->userInformation->philhealth_number,
            'pagibig_number' => $employee->userInformation->pagibig_number,
            'tin_number' => $employee->userInformation->tin_number,
            'tax_status' => $employee->userInformation->tax_status,
            'dependents' => $employee->userInformation->number_of_dependents,
        ];
    });
```

### Search Employees by Personal Info
```php
// Search by name (in user_information)
$employees = Employee::whereHas('userInformation', function ($query) use ($searchTerm) {
    $query->where('first_name', 'like', "%{$searchTerm}%")
          ->orWhere('last_name', 'like', "%{$searchTerm}%")
          ->orWhere('email', 'like', "%{$searchTerm}%");
})->with('userInformation', 'department')->get();
```

### Get Employee 201 File (Complete Profile)
```php
$employee = Employee::with(['userInformation', 'department', 'user'])
    ->where('employee_number', 'EMP-2024-001')
    ->first();

$profile201 = [
    // From user_information
    'personal' => [
        'full_name' => $employee->userInformation->full_name,
        'gender' => $employee->userInformation->gender,
        'date_of_birth' => $employee->userInformation->date_of_birth,
        'place_of_birth' => $employee->userInformation->place_of_birth,
        'civil_status' => $employee->userInformation->civil_status,
        'nationality' => $employee->userInformation->nationality,
    ],
    'contact' => [
        'email' => $employee->userInformation->email,
        'phone' => $employee->userInformation->phone,
        'address' => $employee->userInformation->full_address,
    ],
    'government_ids' => [
        'sss' => $employee->userInformation->sss_number,
        'philhealth' => $employee->userInformation->philhealth_number,
        'pagibig' => $employee->userInformation->pagibig_number,
        'tin' => $employee->userInformation->tin_number,
    ],
    'education' => [
        'highest' => $employee->userInformation->highest_education,
        'school' => $employee->userInformation->school_name,
        'course' => $employee->userInformation->course_degree,
        'year' => $employee->userInformation->year_graduated,
    ],
    // From employees
    'employment' => [
        'employee_number' => $employee->employee_number,
        'position' => $employee->position,
        'department' => $employee->department->name,
        'date_hired' => $employee->date_hired,
        'status' => $employee->employment_status,
        'type' => $employee->employment_type,
        'salary' => $employee->basic_salary,
    ],
    // From users
    'account' => [
        'email' => $employee->user->email,
        'is_active' => $employee->user->is_active,
        'roles' => $employee->user->getRoleNames(),
    ],
];
```

## Migration History

1. **create_users_table** - Basic authentication (email, password)
2. **create_employees_table** - Initial employee structure
3. **add_first_name_last_name_to_users_table** - Separate name fields for users
4. **add_profile_fields_to_users_table** - Applicant profile fields (phone, address, resume, etc.)
5. **add_comprehensive_employee_information** - Added 70+ fields to employees table
6. **create_user_information_table** ⭐ - Created central repository with 100+ fields
7. **refactor_employees_table_remove_personal_info** ⭐ - Removed redundant fields from employees

## Data Migration Strategy

### Step 1: Migrate Existing User Data
```php
// Copy user profile data to user_information
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        UserInformation::create([
            'user_id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone' => $user->phone,
            'address' => $user->address,
            'bio' => $user->bio,
            'date_of_birth' => $user->date_of_birth,
            'profile_picture' => $user->profile_picture,
            'resume_path' => $user->resume_path,
            'linkedin_url' => $user->linkedin_url,
            'portfolio_url' => $user->portfolio_url,
        ]);
    }
});
```

### Step 2: Link Employees to User Information
```php
// For existing employees, update user_information with employee_id
Employee::chunk(100, function ($employees) {
    foreach ($employees as $employee) {
        // Find matching user_information by user_id
        $userInfo = UserInformation::where('user_id', $employee->user_id)->first();
        
        if ($userInfo) {
            // Link to employee
            $userInfo->update(['employee_id' => $employee->id]);
        }
    }
});
```

## Best Practices

### ✅ DO:
- Use eager loading: `Employee::with('userInformation')`
- Validate unique government IDs in user_information table
- Update personal info through user_information model
- Use transactions when creating user + userInformation + employee
- Cache frequently accessed user_information data

### ❌ DON'T:
- Store personal data in users or employees tables
- Duplicate name, address, ID fields
- Query employee personal data without eager loading userInformation
- Forget to link employee_id when converting applicant to employee

## Performance Tips

1. **Eager Load Relationships**
```php
// Good
$employees = Employee::with('userInformation', 'department')->get();

// Bad (N+1 queries)
$employees = Employee::all();
foreach ($employees as $emp) {
    echo $emp->userInformation->full_name; // Query per employee
}
```

2. **Index Frequently Searched Fields**
```sql
-- Already indexed in migration
CREATE INDEX idx_user_information_email ON user_information(email);
CREATE INDEX idx_user_information_user_employee ON user_information(user_id, employee_id);
```

3. **Use Select to Limit Data**
```php
// Only get needed fields
$employees = Employee::with(['userInformation' => function ($query) {
    $query->select('id', 'user_id', 'employee_id', 'first_name', 'last_name', 'email', 'phone');
}])->select('id', 'employee_number', 'position', 'basic_salary')->get();
```

## Summary

**Old Structure** (Redundant):
- Users: name, email, phone, address, etc.
- Employees: first_name, last_name, email, phone, address, etc. (duplicate!)

**New Structure** (Normalized):
- **Users**: email, password only
- **UserInformation**: ALL personal data (single source)
- **Employees**: employment data only

**Result**: Zero redundancy, single source of truth, easy to maintain! 🎉

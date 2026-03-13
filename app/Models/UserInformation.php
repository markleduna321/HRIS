<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserInformation extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        // Foreign Keys
        'user_id',
        'employee_id',
        
        // Personal Information
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'gender',
        'date_of_birth',
        'place_of_birth',
        'civil_status',
        'nationality',
        'religion',
        'blood_type',
        'height',
        'weight',
        
        // Contact Information
        'email',
        'personal_email',
        'phone',
        'alternate_mobile',
        'telephone_number',
        
        // Current Address
        'address',
        'city',
        'state',
        'zip_code',
        'country',
        
        // Permanent Address
        'permanent_address',
        'permanent_city',
        'permanent_state',
        'permanent_zip_code',
        'permanent_country',
        
        // Emergency Contact
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        'emergency_contact_address',
        
        // Spouse/Family Information
        'spouse_name',
        'spouse_occupation',
        'spouse_employer',
        'spouse_contact_number',
        'number_of_children',
        
        // Government IDs
        'sss_number',
        'philhealth_number',
        'pagibig_number',
        'tin_number',
        'drivers_license',
        'passport_number',
        'voters_id',
        
        // Bank Information
        'bank_name',
        'bank_account_number',
        'bank_account_name',
        
        // Beneficiary Information
        'beneficiary_name',
        'beneficiary_relationship',
        'beneficiary_contact',
        'beneficiary_address',
        
        // Education
        'highest_education',
        'school_name',
        'course_degree',
        'year_graduated',
        
        // Skills & Certifications
        'skills',
        'certifications',
        'languages',
        
        // Previous Employment
        'previous_employer',
        'previous_position',
        'previous_employment_from',
        'previous_employment_to',
        'previous_job_responsibilities',
        
        // Character References
        'character_reference_name_1',
        'character_reference_position_1',
        'character_reference_company_1',
        'character_reference_contact_1',
        'character_reference_name_2',
        'character_reference_position_2',
        'character_reference_company_2',
        'character_reference_contact_2',
        
        // Photos/Documents
        'profile_picture',
        'resume_path',
        
        // Social Media
        'linkedin_url',
        'portfolio_url',
        'facebook_url',
        
        // Tax Information
        'tax_status',
        'number_of_dependents',
        
        // Additional Information
        'bio',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_birth' => 'date',
        'previous_employment_from' => 'date',
        'previous_employment_to' => 'date',
        'year_graduated' => 'integer',
        'height' => 'decimal:2',
        'weight' => 'decimal:2',
        'number_of_children' => 'integer',
        'number_of_dependents' => 'integer',
        'skills' => 'array',
        'certifications' => 'array',
        'languages' => 'array',
    ];

    /**
     * Get the user that owns the user information.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the employee that owns the user information.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the full name attribute.
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        $name = trim("{$this->first_name} {$this->middle_name} {$this->last_name}");
        if ($this->suffix) {
            $name .= " {$this->suffix}";
        }
        return $name;
    }

    /**
     * Get the full address attribute.
     *
     * @return string
     */
    public function getFullAddressAttribute()
    {
        return trim("{$this->address}, {$this->city}, {$this->state} {$this->zip_code}, {$this->country}");
    }

    /**
     * Get the full permanent address attribute.
     *
     * @return string
     */
    public function getFullPermanentAddressAttribute()
    {
        return trim("{$this->permanent_address}, {$this->permanent_city}, {$this->permanent_state} {$this->permanent_zip_code}, {$this->permanent_country}");
    }
}

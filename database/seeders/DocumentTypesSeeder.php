<?php

namespace Database\Seeders;

use App\Models\DocumentType;
use Illuminate\Database\Seeder;

class DocumentTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultDocuments = [
            ['name' => 'NBI Clearance', 'key' => 'nbi_clearance', 'description' => 'National Bureau of Investigation clearance certificate', 'sort_order' => 1],
            ['name' => 'Police Clearance', 'key' => 'police_clearance', 'description' => 'Police clearance certificate', 'sort_order' => 2],
            ['name' => 'Barangay Clearance', 'key' => 'barangay_clearance', 'description' => 'Barangay clearance certificate', 'sort_order' => 3],
            ['name' => 'Medical Certificate', 'key' => 'medical_certificate', 'description' => 'Medical examination certificate', 'sort_order' => 4],
            ['name' => 'Birth Certificate', 'key' => 'birth_certificate', 'description' => 'PSA birth certificate', 'sort_order' => 5],
            ['name' => 'Valid ID', 'key' => 'valid_id', 'description' => 'Government-issued valid ID (2 copies)', 'sort_order' => 6],
            ['name' => 'SSS Form', 'key' => 'sss_form', 'description' => 'SSS E-1 or E-4 Form', 'sort_order' => 7],
            ['name' => 'PhilHealth Form', 'key' => 'philhealth_form', 'description' => 'PhilHealth MDR Form', 'sort_order' => 8],
            ['name' => 'Pag-IBIG Form', 'key' => 'pagibig_form', 'description' => 'Pag-IBIG MDF Form', 'sort_order' => 9],
            ['name' => 'TIN ID', 'key' => 'tin_id', 'description' => 'TIN ID or BIR Form 1902', 'sort_order' => 10],
        ];

        foreach ($defaultDocuments as $doc) {
            DocumentType::updateOrCreate(
                ['key' => $doc['key']],
                array_merge($doc, ['is_system_default' => true, 'is_active' => true])
            );
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class DocumentTypeController extends Controller
{
    /**
     * Display a listing of document types.
     */
    public function index(Request $request)
    {
        $query = DocumentType::query();

        // Filter by active status
        if ($request->has('active_only') && $request->boolean('active_only')) {
            $query->where('is_active', true);
        }

        $documentTypes = $query->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json($documentTypes);
    }

    /**
     * Store a newly created document type.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        
        // Generate unique key from name
        $baseKey = Str::slug(str_replace(' ', '_', strtolower($request->name)));
        $key = $baseKey;
        $counter = 1;
        
        while (DocumentType::where('key', $key)->exists()) {
            $key = $baseKey . '_' . $counter;
            $counter++;
        }
        
        $data['key'] = $key;
        $data['is_system_default'] = false;
        
        // Set sort order to last
        $maxOrder = DocumentType::max('sort_order') ?? 0;
        $data['sort_order'] = $maxOrder + 1;

        $documentType = DocumentType::create($data);

        return response()->json($documentType, 201);
    }

    /**
     * Update the specified document type.
     */
    public function update(Request $request, DocumentType $documentType)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Don't allow editing system defaults' keys
        $data = $request->except(['key', 'is_system_default']);
        
        $documentType->update($data);

        return response()->json($documentType);
    }

    /**
     * Remove the specified document type.
     */
    public function destroy(DocumentType $documentType)
    {
        // Prevent deletion of system defaults
        if ($documentType->is_system_default) {
            return response()->json([
                'message' => 'Cannot delete system default document types. You can deactivate it instead.'
            ], 403);
        }

        $documentType->delete();

        return response()->json(['message' => 'Document type deleted successfully']);
    }

    /**
     * Reorder document types.
     */
    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order' => 'required|array',
            'order.*.id' => 'required|exists:document_types,id',
            'order.*.sort_order' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        foreach ($request->order as $item) {
            DocumentType::where('id', $item['id'])
                ->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Document types reordered successfully']);
    }
}

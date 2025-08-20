<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImporterSupplier;
use Illuminate\Http\Request;

class ImporterSupplierController extends Controller
{
    /**
     * Lista svih partnerstava
     */
    public function index()
    {
        return ImporterSupplier::with(['importer','supplier'])->get();
    }

    /**
     * Kreiranje novog partnerstva
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'importer_company_id' => 'required|exists:companies,id',
            'supplier_company_id' => 'required|exists:companies,id',
            'status'              => 'in:pending,active,blocked',
            'started_at'          => 'nullable|date',
            'ended_at'            => 'nullable|date',
            'notes'               => 'nullable|string',
        ]);

        $partnership = ImporterSupplier::create($data);

        return response()->json($partnership->load(['importer','supplier']), 201);
    }

    /**
     * Pregled jednog partnerstva
     */
    public function show(ImporterSupplier $importerSupplier)
    {
        return $importerSupplier->load(['importer','supplier']);
    }

    /**
     * Ažuriranje partnerstva
     */
    public function update(Request $request, ImporterSupplier $importerSupplier)
    {
        $data = $request->validate([
            'status'     => 'in:pending,active,blocked',
            'started_at' => 'nullable|date',
            'ended_at'   => 'nullable|date',
            'notes'      => 'nullable|string',
        ]);

        $importerSupplier->update($data);

        return response()->json($importerSupplier->load(['importer','supplier']));
    }

    /**
     * Brisanje partnerstva
     */
    public function destroy(ImporterSupplier $importerSupplier)
    {
        $importerSupplier->delete();
        return response()->json(['message' => 'Partnership deleted']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    /**
     * Prikaz svih kompanija (uvoznici + dobavljači)
     */
    public function index()
    {
        return Company::with(['users', 'products', 'offers'])->get();
    }

    /**
     * Kreiranje nove kompanije
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'            => 'required|string|max:255',
            'type'            => 'required|in:importer,supplier',
            'tax_id'          => 'nullable|string',
            'country'         => 'required|string',
            'city'            => 'required|string',
            'address'         => 'required|string',
            'zip'             => 'nullable|string',
            'website'         => 'nullable|string',
            'contact_email'   => 'nullable|email',
            'contact_phone'   => 'nullable|string',
            'capabilities'    => 'nullable|array',
            'countries_served'=> 'nullable|string',
            'is_active'       => 'boolean',
        ]);

        $company = Company::create($data);

        return response()->json($company, 201);
    }

    /**
     * Prikaz jedne kompanije sa vezama
     */
    public function show(Company $company)
    {
        return $company->load(['users','products.images','offers.items']);
    }

    /**
     * Izmena kompanije
     */
    public function update(Request $request, Company $company)
    {
        $data = $request->validate([
            'name'            => 'string|max:255',
            'type'            => 'in:importer,supplier',
            'tax_id'          => 'nullable|string',
            'country'         => 'string',
            'city'            => 'string',
            'address'         => 'string',
            'zip'             => 'nullable|string',
            'website'         => 'nullable|string',
            'contact_email'   => 'nullable|email',
            'contact_phone'   => 'nullable|string',
            'capabilities'    => 'nullable|array',
            'countries_served'=> 'nullable|string',
            'is_active'       => 'boolean',
        ]);

        $company->update($data);

        return response()->json($company);
    }

    /**
     * Brisanje kompanije
     */
    public function destroy(Company $company)
    {
        $company->delete();
        return response()->json(['message' => 'Company deleted']);
    }

    /**
     * Pretraga dobavljača po kriterijumu
     */
    public function searchSuppliers(Request $request)
    {
        $query = Company::where('type', 'supplier')->where('is_active', true);

        if ($request->filled('country')) {
            $query->where('country', $request->country);
        }
        if ($request->filled('capability')) {
            $query->whereJsonContains('capabilities', $request->capability);
        }

        return $query->get();
    }
}

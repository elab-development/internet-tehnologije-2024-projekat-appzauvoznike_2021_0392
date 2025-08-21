<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Lista proizvoda.
     * Ako je korisnik uvoznik → vidi samo proizvode partner dobavljača.
     * Ako je supplier → vidi samo svoje proizvode.
     * Ako je admin → vidi sve.
     */
    public function index()
    {
        $user = Auth::user();

        $query = Product::with(['supplier','category','images']);

        if ($user->role === 'importer') {
            // proizvodi samo partner dobavljača
            $supplierIds = $user->company
                ->suppliers()
                ->wherePivot('status', 'active')
                ->pluck('companies.id');
            $query->whereIn('supplier_company_id', $supplierIds);
        }

        if ($user->role === 'supplier') {
            $query->where('supplier_company_id', $user->company_id);
        }

        return $query->get();
    }

    /**
     * Kreiranje novog proizvoda (samo supplier)
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'category_id'     => 'nullable|exists:categories,id',
            'code'            => 'required|string|max:50',
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'image_url'       => 'required|string',
            'length_mm'       => 'nullable|integer',
            'width_mm'        => 'nullable|integer',
            'height_mm'       => 'nullable|integer',
            'weight_g'        => 'nullable|integer',
            'base_price'      => 'required|numeric',
            'currency'        => 'required|string|size:3',
            'characteristics' => 'nullable|array',
            'is_active'       => 'boolean',
        ]);

        $data['supplier_company_id'] = $user->company_id;

        $product = Product::create($data);

        return response()->json($product->load(['category','images']), 201);
    }

    /**
     * Prikaz jednog proizvoda
     */
    public function show(Product $product)
    {
        $user = Auth::user();

        // uvoznik vidi samo ako je partner sa supplier-om
        if ($user->role === 'importer') {
            $isPartner = $user->company
                ->suppliers()
                ->where('companies.id', $product->supplier_company_id)
                ->wherePivot('status','active')
                ->exists();
            if (!$isPartner) {
                return response()->json(['message'=>'Forbidden'], 403);
            }
        }

        // supplier vidi samo svoje
        if ($user->role === 'supplier' && $product->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        return $product->load(['supplier','category','images','offerItems']);
    }

    /**
     * Izmena proizvoda (samo vlasnik supplier)
     */
    public function update(Request $request, Product $product)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier' || $product->supplier_company_id !== $user->company_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'category_id'     => 'nullable|exists:categories,id',
            'code'            => 'string|max:50',
            'name'            => 'string|max:255',
            'description'     => 'nullable|string',
            'image_url'       => 'string',
            'length_mm'       => 'nullable|integer',
            'width_mm'        => 'nullable|integer',
            'height_mm'       => 'nullable|integer',
            'weight_g'        => 'nullable|integer',
            'base_price'      => 'numeric',
            'currency'        => 'string|size:3',
            'characteristics' => 'nullable|array',
            'is_active'       => 'boolean',
        ]);

        $product->update($data);

        return response()->json($product->load(['category','images']));
    }

    /**
     * Brisanje proizvoda (samo vlasnik supplier)
     */
    public function destroy(Product $product)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier' || $product->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        $product->delete();
        return response()->json(['message'=>'Product deleted']);
    }

    /**
     * Pretraga proizvoda (uvoznik vidi samo partner dobavljače)
     */
    public function search(Request $request)
    {
        $user = Auth::user();
        $query = Product::with(['supplier','category']);

        if ($request->filled('name')) {
            $query->where('name', 'like', '%'.$request->name.'%');
        }
        if ($request->filled('code')) {
            $query->where('code', $request->code);
        }

        if ($user->role === 'importer') {
            $supplierIds = $user->company
                ->suppliers()
                ->wherePivot('status', 'active')
                ->pluck('companies.id');
            $query->whereIn('supplier_company_id', $supplierIds);
        }

        if ($user->role === 'supplier') {
            $query->where('supplier_company_id', $user->company_id);
        }

        return $query->get();
    }
}

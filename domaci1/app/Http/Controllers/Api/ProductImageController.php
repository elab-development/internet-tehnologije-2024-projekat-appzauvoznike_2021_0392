<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductImage;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    /**
     * Prikaz svih slika za dati proizvod
     */
    public function index(Product $product)
    {
        $user = Auth::user();

        // supplier može videti samo svoje proizvode
        if ($user->role === 'supplier' && $product->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        // importer može videti slike samo za proizvode partner dobavljača
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

        return $product->images;
    }

    /**
     * Dodavanje nove slike (samo supplier za svoje proizvode)
     */
    public function store(Request $request, Product $product)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier' || $product->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        $data = $request->validate([
            'image'      => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'alt'        => 'nullable|string',
            'is_primary' => 'boolean',
            'sort_order' => 'integer',
        ]);

        // upload fajla
        $path = $request->file('image')->store('products', 'public');
        $data['url'] = '/storage/' . $path;
        $data['product_id'] = $product->id;

        // ako je primarna, resetuj ostale
        if (!empty($data['is_primary']) && $data['is_primary'] === true) {
            $product->images()->update(['is_primary' => false]);
        }

        $image = $product->images()->create($data);

        return response()->json($image, 201);
    }

    /**
     * Prikaz jedne slike
     */
    public function show(Product $product, ProductImage $productImage)
    {
        $user = Auth::user();

        if ($productImage->product_id !== $product->id) {
            return response()->json(['message'=>'Not found'], 404);
        }

        if ($user->role === 'supplier' && $product->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

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

        return $productImage;
    }

    /**
     * Izmena slike (samo supplier)
     */
    public function update(Request $request, Product $product, ProductImage $productImage)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier' || $product->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        if ($productImage->product_id !== $product->id) {
            return response()->json(['message'=>'Not found'], 404);
        }

        $data = $request->validate([
            'image'      => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'alt'        => 'nullable|string',
            'is_primary' => 'boolean',
            'sort_order' => 'integer',
        ]);

        // ako je uploadovana nova slika → obriši staru
        if ($request->hasFile('image')) {
            if ($productImage->url && str_starts_with($productImage->url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $productImage->url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('products', 'public');
            $data['url'] = '/storage/' . $path;
        }

        if (!empty($data['is_primary']) && $data['is_primary'] === true) {
            $product->images()->update(['is_primary' => false]);
        }

        $productImage->update($data);

        return response()->json($productImage);
    }

    /**
     * Brisanje slike (samo supplier)
     */
    public function destroy(Product $product, ProductImage $productImage)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier' || $product->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        if ($productImage->product_id !== $product->id) {
            return response()->json(['message'=>'Not found'], 404);
        }

        // obriši fajl sa diska
        if ($productImage->url && str_starts_with($productImage->url, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $productImage->url);
            Storage::disk('public')->delete($oldPath);
        }

        $productImage->delete();

        return response()->json(['message'=>'Image deleted']);
    }
}

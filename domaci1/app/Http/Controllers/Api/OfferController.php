<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\OfferItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OfferController extends Controller
{
    /**
     * Lista svih ponuda (sa stavkama)
     */
    public function index()
    {
        $user = Auth::user();

        $query = Offer::with(['supplier','items.product']);

        if ($user->role === 'supplier') {
            $query->where('supplier_company_id', $user->company_id);
        }

        if ($user->role === 'importer') {
            $supplierIds = $user->company
                ->suppliers()
                ->wherePivot('status','active')
                ->pluck('companies.id');
            $query->whereIn('supplier_company_id', $supplierIds);
        }

        return $query->get();
    }

    /**
     * Kreiranje nove ponude (samo supplier)
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier') {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        $data = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            'valid_from'     => 'nullable|date',
            'valid_to'       => 'nullable|date',
            'incoterm'       => 'nullable|string',
            'payment_terms'  => 'nullable|string',
            'lead_time_days' => 'nullable|integer',
            'status'         => 'in:draft,published,archived',
        ]);

        $data['supplier_company_id'] = $user->company_id;

        $offer = Offer::create($data);

        return response()->json($offer, 201);
    }

    /**
     * Prikaz jedne ponude
     */
    public function show(Offer $offer)
    {
        $user = Auth::user();

        if ($user->role === 'supplier' && $offer->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        if ($user->role === 'importer') {
            $isPartner = $user->company
                ->suppliers()
                ->where('companies.id',$offer->supplier_company_id)
                ->wherePivot('status','active')
                ->exists();
            if (!$isPartner) {
                return response()->json(['message'=>'Forbidden'], 403);
            }
        }

        return $offer->load(['supplier','items.product']);
    }

    /**
     * Izmena ponude (samo supplier)
     */
    public function update(Request $request, Offer $offer)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier' || $offer->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        $data = $request->validate([
            'title'          => 'string|max:255',
            'description'    => 'nullable|string',
            'valid_from'     => 'nullable|date',
            'valid_to'       => 'nullable|date',
            'incoterm'       => 'nullable|string',
            'payment_terms'  => 'nullable|string',
            'lead_time_days' => 'nullable|integer',
            'status'         => 'in:draft,published,archived',
        ]);

        $offer->update($data);

        return response()->json($offer);
    }

    /**
     * Brisanje ponude (samo supplier)
     */
    public function destroy(Offer $offer)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier' || $offer->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        $offer->delete();
        return response()->json(['message'=>'Offer deleted']);
    }

    /**
     * Dodavanje stavke u ponudu
     */
    public function addItem(Request $request, Offer $offer)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier' || $offer->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        $data = $request->validate([
            'product_id'          => 'required|exists:products,id',
            'unit_price'          => 'required|numeric',
            'currency'            => 'required|string|size:3',
            'min_order_qty'       => 'integer|min:1',
            'pack_qty'            => 'nullable|integer',
            'import_cost_per_unit'=> 'nullable|numeric',
            'discount_percent'    => 'nullable|numeric',
            'notes'               => 'nullable|string',
        ]);

        $data['offer_id'] = $offer->id;

        $item = OfferItem::create($data);

        return response()->json($item->load('product'), 201);
    }

    /**
     * Izmena stavke u ponudi
     */
    public function updateItem(Request $request, Offer $offer, OfferItem $item)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier' || $offer->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

  

        $data = $request->validate([
            'unit_price'          => 'numeric',
            'currency'            => 'string|size:3',
            'min_order_qty'       => 'integer|min:1',
            'pack_qty'            => 'nullable|integer',
            'import_cost_per_unit'=> 'nullable|numeric',
            'discount_percent'    => 'nullable|numeric',
            'notes'               => 'nullable|string',
        ]);

        $item->update($data);

        return response()->json($item->load('product'));
    }

    /**
     * Brisanje stavke u ponudi
     */
    public function destroyItem(Offer $offer, OfferItem $item)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier' || $offer->supplier_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

    
        $item->delete();
        return response()->json(['message'=>'Offer item deleted']);
    }
}

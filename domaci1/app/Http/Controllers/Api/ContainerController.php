<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Container;
use App\Models\ContainerItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContainerController extends Controller
{
    /**
     * Lista svih kontejnera
     * - admin vidi sve
     * - importer vidi samo svoje
     */
    public function index()
    {
        $user = Auth::user();

        $query = Container::with('items.offerItem.product');

        if ($user->role === 'importer') {
            $query->where('importer_company_id', $user->company_id);
        }

        return $query->get();
    }

    /**
     * Kreiranje novog kontejnera (samo importer)
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'importer') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'container_type'        => 'required|string',
            'inner_length_mm'       => 'nullable|integer',
            'inner_width_mm'        => 'nullable|integer',
            'inner_height_mm'       => 'nullable|integer',
            'max_weight_kg'         => 'nullable|numeric',
            'max_volume_m3'         => 'nullable|numeric',
            'estimated_freight_cost'=> 'nullable|numeric',
            'currency'              => 'required|string|size:3',
            'status'                => 'in:draft,planned,shipped,delivered,canceled',
        ]);

        $data['importer_company_id'] = $user->company_id;

        $container = Container::create($data);

        return response()->json($container, 201);
    }

    /**
     * Prikaz jednog kontejnera
     */
    public function show(Container $container)
    {
        $user = Auth::user();

        if ($user->role === 'importer' && $container->importer_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        return $container->load('items.offerItem.product');
    }

    /**
     * Ažuriranje kontejnera (samo vlasnik importer)
     */
    public function update(Request $request, Container $container)
    {
        $user = Auth::user();

        if ($user->role !== 'importer' || $container->importer_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        $data = $request->validate([
            'container_type'        => 'string',
            'inner_length_mm'       => 'nullable|integer',
            'inner_width_mm'        => 'nullable|integer',
            'inner_height_mm'       => 'nullable|integer',
            'max_weight_kg'         => 'nullable|numeric',
            'max_volume_m3'         => 'nullable|numeric',
            'estimated_freight_cost'=> 'nullable|numeric',
            'currency'              => 'string|size:3',
            'status'                => 'in:draft,planned,shipped,delivered,canceled',
        ]);

        $container->update($data);

        return response()->json($container);
    }

    /**
     * Brisanje kontejnera (samo vlasnik importer)
     */
    public function destroy(Container $container)
    {
        $user = Auth::user();

        if ($user->role !== 'importer' || $container->importer_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        $container->delete();
        return response()->json(['message'=>'Container deleted']);
    }

    /**
     * Dodavanje stavke u kontejner
     */
    public function addItem(Request $request, Container $container)
    {
        $user = Auth::user();

        if ($user->role !== 'importer' || $container->importer_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        $data = $request->validate([
            'offer_item_id'       => 'required|exists:offer_items,id',
            'quantity'            => 'required|integer|min:1',
            'item_length_mm'      => 'nullable|integer',
            'item_width_mm'       => 'nullable|integer',
            'item_height_mm'      => 'nullable|integer',
            'item_weight_g'       => 'nullable|integer',
            'unit_price'          => 'nullable|numeric',
            'import_cost_per_unit'=> 'nullable|numeric',
            'currency'            => 'required|string|size:3',
        ]);

        $data['container_id'] = $container->id;

        $item = ContainerItem::create($data);

        return response()->json($item, 201);
    }

    /**
     * Izmena stavke kontejnera
     */
    public function updateItem(Request $request, Container $container, ContainerItem $item)
    {
        $user = Auth::user();

        if ($user->role !== 'importer' || $container->importer_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        if ($item->container_id !== $container->id) {
            return response()->json(['message'=>'Item not found in this container'], 404);
        }

        $data = $request->validate([
            'quantity'            => 'integer|min:1',
            'item_length_mm'      => 'nullable|integer',
            'item_width_mm'       => 'nullable|integer',
            'item_height_mm'      => 'nullable|integer',
            'item_weight_g'       => 'nullable|integer',
            'unit_price'          => 'nullable|numeric',
            'import_cost_per_unit'=> 'nullable|numeric',
            'currency'            => 'string|size:3',
        ]);

        $item->update($data);

        return response()->json($item);
    }

    /**
     * Brisanje stavke kontejnera
     */
    public function destroyItem(Container $container, ContainerItem $item)
    {
        $user = Auth::user();

        if ($user->role !== 'importer' || $container->importer_company_id !== $user->company_id) {
            return response()->json(['message'=>'Forbidden'], 403);
        }

        if ($item->container_id !== $container->id) {
            return response()->json(['message'=>'Item not found in this container'], 404);
        }

        $item->delete();
        return response()->json(['message'=>'Item deleted']);
    }
}

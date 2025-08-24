<?php
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ContainerController;
use App\Http\Controllers\Api\ImporterSupplierController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductImageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==================== AUTH ====================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});
Route::get('companies-public', [CompanyController::class, 'index']);

// ==================== ADMIN ====================
Route::middleware(['auth:sanctum','role:admin'])->prefix('admin')->group(function () {
    // Admin ima potpuni CRUD nad svim kompanijama
    Route::apiResource('companies', CompanyController::class);

    // Admin vidi i upravlja svim partnerstvima
    Route::apiResource('partnerships', ImporterSupplierController::class);

    // Admin ima pregled svih proizvoda i ponuda
    Route::apiResource('products', ProductController::class)->only(['index','show']);
    Route::get('products-search', [ProductController::class, 'search']);
    Route::apiResource('offers', OfferController::class)->only(['index','show']);

    // Admin ima pregled svih kontejnera
    Route::apiResource('containers', ContainerController::class)->only(['index','show']);
});

// ==================== SUPPLIER ====================
Route::middleware(['auth:sanctum','role:supplier'])->prefix('supplier')->scopeBindings()->group(function () {
    // Supplier upravlja samo svojim proizvodima
    Route::apiResource('products', ProductController::class);
    Route::get('products-search', [ProductController::class, 'search']);

    // Slike proizvoda
          // Dodajemo "->parameters(['images' => 'productImage'])" da bi ime parametra u ruti
        // bilo {productImage}, isto kao tip hint u kontroleru (ProductImage $productImage).
        // Bez ovoga Laravel bi koristio {image}, pa bi route–model binding pravio 404.
        Route::apiResource('products.images', ProductImageController::class)
            ->parameters(['images' => 'productImage']);

 
    // Supplier kreira i menja svoje ponude
    Route::apiResource('offers', OfferController::class); 
    Route::post   ('offers/{offer}/items',            [OfferController::class, 'addItem']);
    Route::put    ('offers/{offer}/items/{item}',     [OfferController::class, 'updateItem']);
    Route::delete ('offers/{offer}/items/{item}',     [OfferController::class, 'destroyItem']);

});

// ==================== IMPORTER ====================
Route::middleware(['auth:sanctum','role:importer'])->prefix('importer')->group(function () {
    // Importer može pretraživati dobavljače
    Route::get('suppliers/search', [CompanyController::class, 'searchSuppliers']);

    // Importer može upravljati partnerstvima sa dobavljačima
    Route::apiResource('partnerships', ImporterSupplierController::class)->only(['index','store','update','destroy','show']);

    // Importer vidi proizvode i ponude samo partner dobavljača
    Route::apiResource('products', ProductController::class)->only(['index','show']);
    Route::get('products-search', [ProductController::class, 'search']);
    Route::apiResource('offers', OfferController::class)->only(['index','show']);

    // Importer upravlja kontejnerima
    Route::apiResource('containers', ContainerController::class);
    Route::post('containers/{container}/items', [ContainerController::class, 'addItem']);
    Route::put('containers/{container}/items/{item}', [ContainerController::class, 'updateItem']);
    Route::delete('containers/{container}/items/{item}', [ContainerController::class, 'destroyItem']);
});

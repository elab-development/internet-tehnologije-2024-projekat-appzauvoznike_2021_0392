<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ContainerController;
use App\Http\Controllers\Api\ImporterSupplierController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductImageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


// Kompanije
Route::apiResource('companies', CompanyController::class);

// Pretraga dobavljača
Route::get('suppliers/search', [CompanyController::class, 'searchSuppliers']);

// Partnerstva (uvoznik–dobavljač)
Route::apiResource('partnerships', ImporterSupplierController::class);
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // primer ograničenja na role
        Route::get('/admin-only', function () {
            return ['message' => 'Samo admini vide ovo'];
        })->middleware('role:admin');

        Route::get('/suppliers-only', function () {
            return ['message' => 'Samo dobavljači vide ovo'];
        })->middleware('role:supplier');

        Route::get('/importers-or-admins', function () {
            return ['message' => 'Uvoznici i admini vide ovo'];
        })->middleware('role:importer,admin');
    });


      Route::apiResource('products', ProductController::class);

        // dodatna ruta za pretragu
        Route::get('products-search', [ProductController::class, 'search']);


        Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('products.images', ProductImageController::class);

         // kontejneri
        Route::apiResource('containers', ContainerController::class);

        // stavke kontejnera (nested)
        Route::post('containers/{container}/items', [ContainerController::class, 'addItem']);
        Route::put('containers/{container}/items/{item}', [ContainerController::class, 'updateItem']);
        Route::delete('containers/{container}/items/{item}', [ContainerController::class, 'destroyItem']);
});
});
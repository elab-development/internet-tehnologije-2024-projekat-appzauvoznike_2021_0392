<?php

use App\Http\Controllers\Auth\AuthController;
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
});
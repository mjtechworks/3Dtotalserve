<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// use Illuminate\Http\Response;
use App\Http\Controllers\api\FurnitureController;

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


// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route::get('/', function () {
//     return response('Hello World', 200);
// });


Route::namespace('api')->group(function () {
    Route::get('/product/{userid}', [FurnitureController::class, 'getfurniture']);
    Route::post('/product', [FurnitureController::class, 'createfurniture']);
    Route::get('/product/{userid}', [FurnitureController::class, 'getfurnituredetail']);
    Route::delete('/product', [FurnitureController::class, 'index']);

});

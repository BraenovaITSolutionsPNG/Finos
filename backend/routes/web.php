<?php

use App\Http\Controllers\Api\FileController;
use Illuminate\Support\Facades\Route;

Route::get('files/{path}', [FileController::class, 'show'])->where('path', '.*');

Route::get('/', function () {
    return view('welcome');
});

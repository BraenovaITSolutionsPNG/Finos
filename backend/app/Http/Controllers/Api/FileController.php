<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function show(string $path)
    {
        abort_if(str_contains($path, '..'), 404);

        $full = Storage::disk('public')->path($path);
        abort_unless(file_exists($full), 404);

        return Response::file($full);
    }
}

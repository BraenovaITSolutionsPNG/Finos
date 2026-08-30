<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:5120'],
            'folder' => ['nullable', 'string', 'in:uploads,logos'],
        ]);

        $tenant = TenantContext::requireTenant();
        $file = $request->file('file');
        $folder = $request->input('folder', 'uploads');
        $safeName = preg_replace('/[^A-Za-z0-9.\-_]/', '_', $file->getClientOriginalName());
        $path = $file->storeAs("{$folder}/{$tenant->id}", time() . '_' . $safeName, 'public');

        return response()->json([
            'url' => rtrim(config('app.url'), '/') . '/files/' . $path,
            'name' => $file->getClientOriginalName(),
        ], 201);
    }
}

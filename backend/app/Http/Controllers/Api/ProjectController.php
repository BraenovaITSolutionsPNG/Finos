<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectStoreRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Invoice;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Project::class);
        $projects = Project::with('customer')->withCount(['invoices', 'bills'])->orderByDesc('created_at')->get();

        return response()->json(ProjectResource::collection($projects));
    }

    public function store(ProjectStoreRequest $request): JsonResponse
    {
        $this->authorize('create', Project::class);
        $project = Project::create($request->validated());

        return response()->json(new ProjectResource($project->load('customer')), 201);
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorize('view', $project);
        $invoiced = $project->invoices()->sum('total');
        $billed = $project->bills()->sum('total');

        return response()->json([
            'project' => new ProjectResource($project->load('customer')),
            'financials' => [
                'budget' => (float) $project->budget,
                'invoiced' => (float) $invoiced,
                'billed' => (float) $billed,
                'margin' => (float) ($invoiced - $billed),
            ],
        ]);
    }

    public function update(ProjectStoreRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);
        $project->update($request->validated());

        return response()->json(new ProjectResource($project->load('customer')));
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);
        $project->delete();

        return response()->json(['message' => 'Project deleted.']);
    }
}

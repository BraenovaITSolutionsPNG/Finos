<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeStoreRequest;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;

class EmployeeController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Employee::class);

        return response()->json(EmployeeResource::collection(Employee::orderBy('name')->get()));
    }

    public function store(EmployeeStoreRequest $request): JsonResponse
    {
        $this->authorize('create', Employee::class);
        $employee = Employee::create($request->validated());

        return response()->json(new EmployeeResource($employee), 201);
    }

    public function show(Employee $employee): JsonResponse
    {
        $this->authorize('view', $employee);

        return response()->json(new EmployeeResource($employee));
    }

    public function update(EmployeeStoreRequest $request, Employee $employee): JsonResponse
    {
        $this->authorize('update', $employee);
        $employee->update($request->validated());

        return response()->json(new EmployeeResource($employee));
    }

    public function destroy(Employee $employee): JsonResponse
    {
        $this->authorize('delete', $employee);
        $employee->delete();

        return response()->json(['message' => 'Employee deleted.']);
    }
}

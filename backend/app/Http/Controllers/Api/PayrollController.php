<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PayrollRunStoreRequest;
use App\Http\Resources\PayrollRunResource;
use App\Mail\PayrollProcessed;
use App\Models\Employee;
use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class PayrollController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', PayrollRun::class);
        $runs = PayrollRun::orderByDesc('created_at')->paginate(25);

        return response()->json(PayrollRunResource::collection($runs));
    }

    public function show(PayrollRun $payrollRun): JsonResponse
    {
        $this->authorize('view', $payrollRun);

        return response()->json(new PayrollRunResource($payrollRun->load('payslips.employee')));
    }

    public function process(PayrollRunStoreRequest $request): JsonResponse
    {
        $this->authorize('create', PayrollRun::class);
        $rate = (float) ($request->validated()['deduction_rate'] ?? 0);

        $employees = Employee::where('is_active', true)->get();
        $run = PayrollRun::create([
            'period_start' => $request->validated()['period_start'],
            'period_end' => $request->validated()['period_end'],
            'status' => 'processed',
            'created_by' => auth()->id(),
            'employee_count' => $employees->count(),
        ]);

        $totals = ['total_gross' => 0, 'total_deductions' => 0, 'total_net' => 0];
        foreach ($employees as $emp) {
            $gross = (float) $emp->salary;
            $ded = round($gross * $rate / 100, 2);
            $net = $gross - $ded;
            $totals['total_gross'] += $gross;
            $totals['total_deductions'] += $ded;
            $totals['total_net'] += $net;
            $run->payslips()->create([
                'employee_id' => $emp->id,
                'gross' => $gross,
                'deductions' => $ded,
                'net' => $net,
                'details' => ['salary' => $gross, 'deduction_rate' => $rate],
            ]);
        }

        $run->update($totals);

        $business = TenantContext::requireTenant()->settings ?? [];
        try {
            Mail::to(auth()->user()->email)->send(new PayrollProcessed($run, $business));
        } catch (\Throwable $e) {
            report($e);
        }

        return response()->json(new PayrollRunResource($run->load('payslips.employee')), 201);
    }

    public function markPaid(PayrollRun $payrollRun): JsonResponse
    {
        $this->authorize('update', $payrollRun);
        $payrollRun->update(['status' => 'paid']);

        return response()->json(new PayrollRunResource($payrollRun));
    }
}

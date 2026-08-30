<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InvoiceStoreRequest;
use App\Http\Resources\InvoiceResource;
use App\Mail\InvoiceSent;
use App\Models\Invoice;
use App\Services\Ledger;
use App\Support\TenantContext;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\Response;

class InvoiceController extends Controller
{
    public function index(): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);
        $invoices = Invoice::with('customer')->orderByDesc('issue_date')->paginate(25);

        return response()->json(InvoiceResource::collection($invoices));
    }

    public function store(InvoiceStoreRequest $request): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $data = $request->validated();

        $invoice = Invoice::create([
            'customer_id' => $data['customer_id'],
            'number' => $data['number'],
            'issue_date' => $data['issue_date'],
            'due_date' => $data['due_date'] ?? null,
            'status' => $data['status'] ?? 'draft',
            'currency' => $data['currency'] ?? null,
            'notes' => $data['notes'] ?? null,
            'attachment_url' => $data['attachment_url'] ?? null,
        ]);

        foreach ($data['items'] as $item) {
            $invoice->items()->create($item);
        }

        $invoice->load('items')->recalculate();
        $invoice->save();

        if ($invoice->status !== 'draft') {
            (new Ledger)->postInvoice($invoice);
        }

        return response()->json(new InvoiceResource($invoice->load('items', 'customer')), 201);
    }

    public function show(Invoice $invoice): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);

        return response()->json(new InvoiceResource($invoice->load('items', 'customer')));
    }

    public function update(InvoiceStoreRequest $request, Invoice $invoice): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $data = $request->validated();

        $invoice->update([
            'customer_id' => $data['customer_id'],
            'number' => $data['number'],
            'issue_date' => $data['issue_date'],
            'due_date' => $data['due_date'] ?? null,
            'status' => $data['status'] ?? $invoice->status,
            'currency' => $data['currency'] ?? null,
            'notes' => $data['notes'] ?? null,
            'attachment_url' => $data['attachment_url'] ?? $invoice->attachment_url,
        ]);

        $invoice->items()->delete();
        foreach ($data['items'] as $item) {
            $invoice->items()->create($item);
        }

        $invoice->load('items')->recalculate();
        $invoice->save();

        if ($invoice->status !== 'draft') {
            (new Ledger)->postInvoice($invoice);
        }

        return response()->json(new InvoiceResource($invoice->load('items', 'customer')));
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        (new Ledger)->deleteFor($invoice);
        $invoice->delete();

        return response()->json(['message' => 'Invoice deleted.']);
    }

    public function send(Invoice $invoice): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $invoice->load('customer', 'items');
        $customer = $invoice->customer;

        if (! $customer || ! $customer->email) {
            return response()->json(['message' => 'Customer has no email address.'], 422);
        }

        $business = TenantContext::requireTenant()->settings ?? [];

        try {
            Mail::to($customer->email)->send(new InvoiceSent($invoice, $business));
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['message' => 'Unable to send email: '.$e->getMessage()], 500);
        }

        return response()->json([
            'message' => 'Invoice emailed to '.$customer->email,
            'sent_to' => $customer->email,
        ]);
    }

    public function pdf(Invoice $invoice): Response
    {
        abort_unless(TenantContext::can('finance:view'), 403);
        $invoice->load('customer', 'items');
        $business = TenantContext::requireTenant()->settings ?? [];

        $pdf = Pdf::loadView('invoices.pdf', compact('invoice', 'business'));

        return $pdf->download('invoice-'.$invoice->number.'.pdf');
    }
}

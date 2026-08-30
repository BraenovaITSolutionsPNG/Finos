<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ImportExportController extends Controller
{
    public function exportCustomers(Request $request): StreamedResponse
    {
        $tenant = TenantContext::requireTenant();
        $rows = Customer::where('tenant_id', $tenant->id)->get();
        $cols = ['name', 'email', 'phone', 'tax_id', 'address'];

        return $this->csv('customers.csv', $cols, $rows);
    }

    public function exportInvoices(Request $request): StreamedResponse
    {
        $tenant = TenantContext::requireTenant();
        $rows = Invoice::where('tenant_id', $tenant->id)->get();
        $cols = ['number', 'customer_id', 'issue_date', 'due_date', 'status', 'subtotal', 'tax', 'total', 'amount_paid'];

        return $this->csv('invoices.csv', $cols, $rows);
    }

    public function importCustomers(Request $request): JsonResponse
    {
        $count = $this->importCsv($request, ['name', 'email', 'phone', 'tax_id', 'address'], function (array $row) {
            if (empty($row['name'])) {
                return;
            }
            Customer::create([
                'name' => $row['name'],
                'email' => $row['email'] ?? null,
                'phone' => $row['phone'] ?? null,
                'tax_id' => $row['tax_id'] ?? null,
                'address' => $row['address'] ?? null,
            ]);
        });

        return response()->json(['imported' => $count]);
    }

    public function importInvoices(Request $request): JsonResponse
    {
        $count = $this->importCsv($request, ['number', 'customer_id', 'issue_date', 'due_date', 'status', 'subtotal', 'tax', 'total', 'amount_paid'], function (array $row) {
            if (empty($row['number']) || empty($row['customer_id'])) {
                return;
            }
            Invoice::create([
                'number' => $row['number'],
                'customer_id' => $row['customer_id'],
                'issue_date' => $row['issue_date'] ?? now()->toDateString(),
                'due_date' => $row['due_date'] ?? null,
                'status' => $row['status'] ?? 'draft',
                'subtotal' => $row['subtotal'] ?? 0,
                'tax' => $row['tax'] ?? 0,
                'total' => $row['total'] ?? ($row['subtotal'] ?? 0),
                'amount_paid' => $row['amount_paid'] ?? 0,
            ]);
        });

        return response()->json(['imported' => $count]);
    }

    protected function csv(string $filename, array $cols, $rows): StreamedResponse
    {
        $callback = function () use ($cols, $rows) {
            $out = fopen('php://output', 'w');
            fputcsv($out, $cols);
            foreach ($rows as $row) {
                fputcsv($out, array_map(fn ($c) => $row->{$c} ?? '', $cols));
            }
            fclose($out);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ]);
    }

    protected function importCsv(Request $request, array $expected, callable $rowHandler): int
    {
        $request->validate(['file' => 'required|file|mimes:csv,txt|max:2048']);
        $handle = fopen($request->file('file')->getRealPath(), 'r');
        $header = fgetcsv($handle);
        if (! $header) {
            return 0;
        }
        $header = array_map('trim', $header);
        $map = [];
        foreach ($header as $i => $col) {
            if (in_array($col, $expected, true)) {
                $map[$col] = $i;
            }
        }
        $count = 0;
        while (($data = fgetcsv($handle)) !== false) {
            $row = [];
            foreach ($expected as $col) {
                $row[$col] = isset($map[$col]) ? ($data[$map[$col]] ?? null) : null;
            }
            $rowHandler($row);
            $count++;
        }
        fclose($handle);

        return $count;
    }
}

<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #111;">
  <h2 style="margin-bottom: 4px;">{{ $business['company_name'] ?? 'FinOS' }}</h2>
  <p style="color: #666; margin-top: 0;">{{ $business['tax_id'] ?? '' }}</p>

  <p>Hi {{ $invoice->customer->name ?? 'Customer' }},</p>
  <p>Please find invoice <strong>{{ $invoice->number }}</strong> attached. A summary is below.</p>

  <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
    <tr style="background: #f3f4f6;">
      <th style="text-align: left; padding: 8px; border: 1px solid #e5e7eb;">Description</th>
      <th style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">Qty</th>
      <th style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">Amount</th>
    </tr>
    @foreach ($invoice->items as $item)
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">{{ $item->description }}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">{{ $item->quantity }}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">{{ number_format($item->amount, 2) }}</td>
      </tr>
    @endforeach
  </table>

  <p style="text-align: right; font-size: 15px;">
    Total: <strong>{{ $invoice->currency }} {{ number_format($invoice->total, 2) }}</strong>
  </p>

  <p style="color: #666; font-size: 12px;">Thank you for your business.</p>
</body>
</html>

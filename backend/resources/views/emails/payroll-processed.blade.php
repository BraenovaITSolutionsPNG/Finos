<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #111;">
  <h2 style="margin-bottom: 4px;">{{ $business['company_name'] ?? 'FinOS' }}</h2>
  <p>A payroll run has been processed.</p>

  <ul style="font-size: 14px;">
    <li>Period: {{ $run->period_start }} to {{ $run->period_end }}</li>
    <li>Employees: {{ $run->employee_count }}</li>
    <li>Gross: {{ number_format($run->total_gross, 2) }}</li>
    <li>Deductions: {{ number_format($run->total_deductions, 2) }}</li>
    <li>Net: {{ number_format($run->total_net, 2) }}</li>
  </ul>

  <p style="color: #666; font-size: 12px;">This is an automated notification from FinOS.</p>
</body>
</html>

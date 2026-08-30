<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #111;">
  <h2 style="margin-bottom: 4px;">{{ $business['company_name'] ?? 'FinOS' }}</h2>
  <p>The following budgets are over their actual spend:</p>

  <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
    <tr style="background: #f3f4f6;">
      <th style="text-align: left; padding: 8px; border: 1px solid #e5e7eb;">Account</th>
      <th style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">Budget</th>
      <th style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">Actual</th>
      <th style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">Variance</th>
    </tr>
    @foreach ($overBudget as $row)
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">{{ $row['account'] }}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">{{ number_format($row['budget'], 2) }}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">{{ number_format($row['actual'], 2) }}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb; color: #b91c1c;">{{ number_format($row['variance'], 2) }}</td>
      </tr>
    @endforeach
  </table>

  <p style="color: #666; font-size: 12px;">This is an automated notification from FinOS.</p>
</body>
</html>

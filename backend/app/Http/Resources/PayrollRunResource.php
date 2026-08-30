<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PayrollRunResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'period_start' => $this->period_start,
            'period_end' => $this->period_end,
            'status' => $this->status,
            'employee_count' => $this->employee_count,
            'total_gross' => $this->total_gross,
            'total_deductions' => $this->total_deductions,
            'total_net' => $this->total_net,
            'payslips' => $this->whenLoaded('payslips', fn () => PayslipResource::collection($this->payslips)),
        ];
    }
}

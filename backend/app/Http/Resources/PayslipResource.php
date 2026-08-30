<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PayslipResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'payroll_run_id' => $this->payroll_run_id,
            'employee_id' => $this->employee_id,
            'employee' => $this->whenLoaded('employee', fn () => new EmployeeResource($this->employee)),
            'gross' => $this->gross,
            'deductions' => $this->deductions,
            'net' => $this->net,
            'details' => $this->details,
        ];
    }
}

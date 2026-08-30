<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'position' => $this->position,
            'salary' => $this->salary,
            'currency' => $this->currency,
            'pay_frequency' => $this->pay_frequency,
            'hired_at' => $this->hired_at,
            'is_active' => $this->is_active,
        ];
    }
}

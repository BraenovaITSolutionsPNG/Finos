<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'payable_type' => $this->payable_type,
            'payable_id' => $this->payable_id,
            'account_id' => $this->account_id,
            'date' => $this->date,
            'amount' => $this->amount,
            'method' => $this->method,
            'reference' => $this->reference,
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BankAccountResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'bank_name' => $this->bank_name,
            'account_number' => $this->account_number,
            'currency' => $this->currency,
            'opening_balance' => $this->opening_balance,
            'current_balance' => $this->current_balance,
            'is_active' => $this->is_active,
            'gl_account' => $this->whenLoaded('glAccount', fn () => new AccountResource($this->glAccount)),
            'created_at' => $this->created_at,
        ];
    }
}

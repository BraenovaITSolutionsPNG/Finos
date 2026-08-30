<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BudgetResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'account_id' => $this->account_id,
            'year' => $this->year,
            'month' => $this->month,
            'amount' => $this->amount,
            'notes' => $this->notes,
            'account' => $this->whenLoaded('account', fn () => new AccountResource($this->account)),
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BankTransactionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'bank_account_id' => $this->bank_account_id,
            'date' => $this->date,
            'description' => $this->description,
            'reference' => $this->reference,
            'type' => $this->type,
            'amount' => $this->amount,
            'is_reconciled' => $this->is_reconciled,
            'matched_journal_line_id' => $this->matched_journal_line_id,
        ];
    }
}

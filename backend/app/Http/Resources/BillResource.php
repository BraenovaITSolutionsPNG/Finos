<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'vendor' => new VendorResource($this->whenLoaded('vendor')),
            'vendor_id' => $this->vendor_id,
            'issue_date' => $this->issue_date,
            'due_date' => $this->due_date,
            'status' => $this->status,
            'currency' => $this->currency,
            'subtotal' => $this->subtotal,
            'tax' => $this->tax,
            'total' => $this->total,
            'amount_paid' => $this->amount_paid,
            'amount_due' => $this->amountDue(),
            'notes' => $this->notes,
            'items' => BillItemResource::collection($this->whenLoaded('items')),
        ];
    }
}

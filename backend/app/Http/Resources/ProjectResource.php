<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'status' => $this->status,
            'customer_id' => $this->customer_id,
            'customer' => $this->whenLoaded('customer', fn () => new CustomerResource($this->customer)),
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'budget' => $this->budget,
            'description' => $this->description,
            'invoiced' => $this->whenCounted('invoices', fn () => $this->invoices_count),
            'created_at' => $this->created_at,
        ];
    }
}

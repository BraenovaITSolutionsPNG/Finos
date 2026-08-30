<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'payment_reference' => $this->payment_reference,
            'payment_receipt_url' => $this->payment_receipt_url,
            'payment_notes' => $this->payment_notes,
            'trial_ends_at' => $this->trial_ends_at,
            'current_period_start' => $this->current_period_start,
            'current_period_end' => $this->current_period_end,
            'plan' => $this->whenLoaded('plan', fn () => new PlanResource($this->plan)),
        ];
    }
}

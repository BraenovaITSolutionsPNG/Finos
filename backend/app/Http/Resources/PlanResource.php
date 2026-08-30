<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'price' => $this->price,
            'interval' => $this->interval,
            'trial_days' => $this->trial_days,
            'features' => $this->features,
            'is_active' => $this->is_active,
        ];
    }
}

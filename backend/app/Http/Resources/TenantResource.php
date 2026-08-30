<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TenantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'plan' => $this->plan,
            'status' => $this->status,
            'country' => $this->country,
            'currency' => $this->currency,
            'locale' => $this->locale,
            'settings' => $this->settings,
            'created_at' => $this->created_at,
            'role' => $this->whenPivotLoaded('tenant_user', fn () => $this->pivot->role),
        ];
    }
}

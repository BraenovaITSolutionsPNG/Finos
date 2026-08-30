<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->whenPivotLoaded('tenant_user', fn () => $this->pivot->role),
            'joined_at' => $this->whenPivotLoaded('tenant_user', fn () => $this->pivot->joined_at),
            'invited_by' => $this->whenPivotLoaded('tenant_user', fn () => $this->pivot->invited_by),
        ];
    }
}

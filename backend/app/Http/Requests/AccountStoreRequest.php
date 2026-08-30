<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class AccountStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tenantId = Auth::user()->current_tenant_id;

        return [
            'code' => ['required', 'string', 'max:30', 'unique:accounts,code,null,id,tenant_id,'.$tenantId],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:asset,liability,equity,income,expense'],
            'subtype' => ['nullable', 'string', 'max:100'],
            'parent_id' => ['nullable', 'exists:accounts,id'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'opening_balance' => ['nullable', 'numeric'],
        ];
    }
}

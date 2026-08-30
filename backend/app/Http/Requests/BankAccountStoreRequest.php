<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BankAccountStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:120',
            'bank_name' => 'nullable|string|max:120',
            'account_number' => 'nullable|string|max:60',
            'currency' => 'nullable|string|size:3',
            'account_id' => 'nullable|exists:accounts,id',
            'opening_balance' => 'sometimes|numeric',
            'is_active' => 'sometimes|boolean',
        ];
    }
}

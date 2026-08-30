<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BudgetStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'account_id' => 'required|exists:accounts,id',
            'year' => 'required|integer|min:2000|max:2100',
            'month' => 'sometimes|integer|min:0|max:12',
            'amount' => 'required|numeric',
            'notes' => 'nullable|string',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payable_type' => ['required', Rule::in(['invoice', 'bill'])],
            'payable_id' => ['required', 'integer'],
            'account_id' => ['nullable', 'exists:accounts,id'],
            'date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0.0001'],
            'method' => ['nullable', 'in:cash,bank,card,other'],
            'reference' => ['nullable', 'string', 'max:100'],
        ];
    }
}

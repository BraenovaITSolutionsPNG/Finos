<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaxRateStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:120',
            'rate' => 'required|numeric|min:0|max:100',
            'type' => 'required|in:sales,purchase,both',
            'is_default' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
        ];
    }
}

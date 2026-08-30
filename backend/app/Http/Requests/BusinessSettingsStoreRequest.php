<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BusinessSettingsStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => 'nullable|string|max:200',
            'tax_id' => 'nullable|string|max:80',
            'address' => 'nullable|string|max:300',
            'phone' => 'nullable|string|max:60',
            'email' => 'nullable|email|max:160',
            'fiscal_year_start_month' => 'sometimes|integer|min:1|max:12',
            'default_currency' => 'nullable|string|size:3',
            'logo_url' => 'nullable|string|max:300',
        ];
    }
}

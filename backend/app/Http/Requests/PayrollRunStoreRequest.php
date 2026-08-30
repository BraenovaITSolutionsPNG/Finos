<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PayrollRunStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
            'deduction_rate' => 'sometimes|numeric|min:0|max:100',
        ];
    }
}

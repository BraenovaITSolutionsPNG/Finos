<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:160',
            'email' => 'nullable|email|max:160',
            'position' => 'nullable|string|max:120',
            'salary' => 'required|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'pay_frequency' => 'sometimes|in:monthly,fortnightly,weekly',
            'hired_at' => 'nullable|date',
            'is_active' => 'sometimes|boolean',
        ];
    }
}

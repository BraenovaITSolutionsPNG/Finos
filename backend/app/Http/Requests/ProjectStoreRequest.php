<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:160',
            'code' => 'nullable|string|max:40',
            'customer_id' => 'nullable|exists:customers,id',
            'status' => 'sometimes|in:planned,active,on_hold,completed,cancelled',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
        ];
    }
}

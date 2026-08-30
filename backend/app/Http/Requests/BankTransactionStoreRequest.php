<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BankTransactionStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bank_account_id' => 'sometimes|exists:bank_accounts,id',
            'date' => 'required|date',
            'description' => 'required|string|max:200',
            'reference' => 'nullable|string|max:120',
            'type' => 'required|in:credit,debit',
            'amount' => 'required|numeric|gt:0',
            'is_reconciled' => 'sometimes|boolean',
        ];
    }
}

<?php

namespace App\Http\Requests\Sponsorship;

use Illuminate\Foundation\Http\FormRequest;

class StoreSponsorshipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('api')->check();
    }

    public function rules(): array
    {
        return [
            'pet_id' => ['nullable', 'required_without:organization_id', 'exists:pets,id'],
            'organization_id' => ['nullable', 'required_without:pet_id', 'exists:organizations,id'],
            'monthly_amount' => ['required', 'numeric', 'min:1'],
        ];
    }
}

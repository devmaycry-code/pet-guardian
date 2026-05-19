<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('api')->check();
    }

    public function rules(): array
    {
        return [
            'target_type' => ['required', 'string', 'max:80'],
            'target_id' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string', 'max:140'],
            'description' => ['required', 'string'],
        ];
    }
}

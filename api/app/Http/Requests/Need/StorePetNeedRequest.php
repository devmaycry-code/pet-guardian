<?php

namespace App\Http\Requests\Need;

use App\Enums\NeedStatus;
use App\Enums\UrgencyLevel;
use App\Models\PetNeed;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StorePetNeedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('createForPet', [PetNeed::class, $this->route('pet')]) ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:140'],
            'description' => ['required', 'string'],
            'type' => ['required', 'string', 'max:60'],
            'goal_amount' => ['required', 'numeric', 'min:1'],
            'current_amount' => ['sometimes', 'numeric', 'min:0'],
            'urgency_level' => ['sometimes', new Enum(UrgencyLevel::class)],
            'status' => ['sometimes', new Enum(NeedStatus::class)],
            'proof_required' => ['sometimes', 'boolean'],
        ];
    }
}

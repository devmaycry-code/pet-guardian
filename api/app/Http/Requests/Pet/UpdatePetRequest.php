<?php

namespace App\Http\Requests\Pet;

use App\Enums\PetStatus;
use App\Enums\UrgencyLevel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdatePetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('pet')) ?? false;
    }

    public function rules(): array
    {
        $petId = $this->route('pet')?->id;

        return [
            'organization_id' => ['sometimes', 'nullable', 'exists:organizations,id'],
            'temporary_home_id' => ['sometimes', 'nullable', 'exists:temporary_homes,id'],
            'name' => ['sometimes', 'string', 'max:120'],
            'slug' => ['sometimes', 'string', 'max:140', Rule::unique('pets', 'slug')->ignore($petId)],
            'species' => ['sometimes', 'string', 'max:60'],
            'gender' => ['sometimes', 'string', 'max:40'],
            'age' => ['sometimes', 'string', 'max:60'],
            'size' => ['sometimes', 'string', 'max:40'],
            'status' => ['sometimes', new Enum(PetStatus::class)],
            'urgency_level' => ['sometimes', new Enum(UrgencyLevel::class)],
            'story' => ['sometimes', 'string'],
            'rescue_story' => ['nullable', 'string'],
            'avatar' => ['nullable', 'string', 'max:255'],
            'avatar_file' => ['nullable', 'file', 'image', 'max:5120'],
            'city' => ['sometimes', 'string', 'max:120'],
            'state' => ['sometimes', 'string', 'size:2'],
        ];
    }
}

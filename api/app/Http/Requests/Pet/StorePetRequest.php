<?php

namespace App\Http\Requests\Pet;

use App\Enums\PetStatus;
use App\Enums\UrgencyLevel;
use App\Models\Pet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StorePetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Pet::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'organization_id' => ['nullable', 'exists:organizations,id'],
            'temporary_home_id' => ['nullable', 'exists:temporary_homes,id'],
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'string', 'max:140', 'unique:pets,slug'],
            'species' => ['required', 'string', 'max:60'],
            'gender' => ['required', 'string', 'max:40'],
            'age' => ['required', 'string', 'max:60'],
            'size' => ['required', 'string', 'max:40'],
            'status' => ['sometimes', new Enum(PetStatus::class)],
            'urgency_level' => ['sometimes', new Enum(UrgencyLevel::class)],
            'story' => ['required', 'string'],
            'rescue_story' => ['nullable', 'string'],
            'avatar' => ['nullable', 'string', 'max:255'],
            'avatar_file' => ['nullable', 'file', 'image', 'max:5120'],
            'city' => ['required', 'string', 'max:120'],
            'state' => ['required', 'string', 'size:2'],
        ];
    }
}

<?php

namespace App\Http\Requests\Timeline;

use App\Models\TimelinePost;
use Illuminate\Foundation\Http\FormRequest;

class StoreTimelinePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('createForPet', [TimelinePost::class, $this->route('pet')]) ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:140'],
            'content' => ['required', 'string'],
            'type' => ['sometimes', 'string', 'max:60'],
            'image' => ['nullable', 'string', 'max:255'],
        ];
    }
}

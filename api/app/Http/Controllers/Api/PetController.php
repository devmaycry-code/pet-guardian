<?php

namespace App\Http\Controllers\Api;

use App\Jobs\OptimizePetAvatarJob;
use App\Http\Controllers\Controller;
use App\Http\Requests\Pet\StorePetRequest;
use App\Http\Requests\Pet\UpdatePetRequest;
use App\Http\Resources\PetResource;
use App\Models\Pet;
use App\Services\Pet\PetService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PetController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly PetService $petService) {}

    public function index(Request $request): JsonResponse
    {
        return $this->success(PetResource::collection($this->petService->list($request->query()))->response()->getData(true));
    }

    public function show(Pet $pet): JsonResponse
    {
        return $this->success(new PetResource($this->petService->show($pet)));
    }

    public function store(StorePetRequest $request): JsonResponse
    {
        $data = $request->validated();
        $avatarFile = $request->file('avatar_file');
        unset($data['avatar_file']);

        $pet = $this->petService->create($data);

        if ($avatarFile instanceof UploadedFile) {
            $pet = $this->attachAvatar($pet, $avatarFile);
        }

        return $this->success(new PetResource($this->petService->show($pet)), 201, 'Pet created');
    }

    public function update(UpdatePetRequest $request, Pet $pet): JsonResponse
    {
        $data = $request->validated();
        $avatarFile = $request->file('avatar_file');
        unset($data['avatar_file']);

        $pet = $this->petService->update($pet, $data);

        if ($avatarFile instanceof UploadedFile) {
            $pet = $this->attachAvatar($pet, $avatarFile);
        }

        return $this->success(new PetResource($this->petService->show($pet)));
    }

    public function destroy(Pet $pet): JsonResponse
    {
        $this->authorize('delete', $pet);
        $this->petService->delete($pet);

        return $this->success(null, 200, 'Pet removed');
    }

    private function attachAvatar(Pet $pet, UploadedFile $avatarFile): Pet
    {
        $directory = sprintf('pets/%s/avatars', $pet->id);
        $filename = Str::uuid().'.'.($avatarFile->extension() ?: $avatarFile->guessExtension() ?: 'jpg');
        $path = $avatarFile->storeAs($directory, $filename, 'public');

        if ($path === false) {
            return $pet;
        }

        $pet->forceFill([
            'avatar' => Storage::disk('public')->url($path),
        ])->save();

        OptimizePetAvatarJob::dispatch($path);

        return $pet->refresh();
    }
}

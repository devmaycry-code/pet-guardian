<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class OptimizePetAvatarJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(public readonly string $path) {}

    public function handle(): void
    {
        $disk = Storage::disk('public');

        if (! $disk->exists($this->path)) {
            return;
        }

        $absolutePath = $disk->path($this->path);
        $imageInfo = @getimagesize($absolutePath);

        if ($imageInfo === false || ! isset($imageInfo[0], $imageInfo[1], $imageInfo['mime'])) {
            return;
        }

        $sourceImage = $this->createSourceImage($absolutePath, $imageInfo['mime']);

        if (! $sourceImage) {
            return;
        }

        $width = (int) $imageInfo[0];
        $height = (int) $imageInfo[1];
        $maxDimension = 1200;
        $scale = min(1, $maxDimension / max($width, $height));

        $targetImage = $sourceImage;

        if ($scale < 1) {
            $targetWidth = max(1, (int) round($width * $scale));
            $targetHeight = max(1, (int) round($height * $scale));
            $targetImage = imagecreatetruecolor($targetWidth, $targetHeight);

            if (in_array($imageInfo['mime'], ['image/png', 'image/webp'], true)) {
                imagealphablending($targetImage, false);
                imagesavealpha($targetImage, true);
            }

            imagecopyresampled(
                $targetImage,
                $sourceImage,
                0,
                0,
                0,
                0,
                $targetWidth,
                $targetHeight,
                $width,
                $height,
            );

            imagedestroy($sourceImage);
        }

        $this->saveImage($targetImage, $absolutePath, $imageInfo['mime']);
        imagedestroy($targetImage);
    }

    private function createSourceImage(string $absolutePath, string $mime): false|\GdImage
    {
        return match ($mime) {
            'image/jpeg' => imagecreatefromjpeg($absolutePath),
            'image/png' => imagecreatefrompng($absolutePath),
            'image/gif' => imagecreatefromgif($absolutePath),
            'image/webp' => function_exists('imagecreatefromwebp') ? imagecreatefromwebp($absolutePath) : false,
            default => false,
        };
    }

    private function saveImage(\GdImage $image, string $absolutePath, string $mime): void
    {
        match ($mime) {
            'image/jpeg' => imagejpeg($image, $absolutePath, 85),
            'image/png' => imagepng($image, $absolutePath, 6),
            'image/gif' => imagegif($image, $absolutePath),
            'image/webp' => function_exists('imagewebp') ? imagewebp($image, $absolutePath, 85) : imagejpeg($image, $absolutePath, 85),
            default => imagejpeg($image, $absolutePath, 85),
        };
    }
}

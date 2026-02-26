<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Filesystem\Filesystem;

class MakeEnumCommand extends Command
{
    protected $signature = 'make:enum
                            {name : Enum name}
                            {--type=string : Enum backing type (string|int)}
                            {--cases= : Comma separated enum cases}';
    // php artisan make:enum UserStatus --cases=ACTIVE,INACTIVE,BLOCKED

    protected $description = 'Create a new Enum class';

    public function handle()
    {
        $name = Str::studly($this->argument('name'));
        $type = $this->option('type');
        $cases = $this->option('cases');
        $namespace = 'App\\Enums';

        $path = app_path("Enums/{$name}.php");

        if (file_exists($path)) {
            $this->error("Enum {$name} already exists!");
            return;
        }

        (new Filesystem)->ensureDirectoryExists(app_path('Enums'));

        // Generate cases
        $casesCode = "    case Example = 'example';";
        if ($cases) {
            $casesArray = explode(',', $cases);
            $casesCode = collect($casesArray)->map(function ($case) use ($type) {
                $case = trim($case);
                $value = $type === 'int' ? rand(1, 100) : strtolower($case);
                return "    case {$case} = '{$value}';";
            })->implode("\n");
        }

        $stub = file_get_contents(base_path('stubs/enum.stub'));

        $content = str_replace(
            ['{{ namespace }}', '{{ class }}', '{{ type }}', '{{ cases }}'],
            [$namespace, $name, $type, $casesCode],
            $stub
        );

        file_put_contents($path, $content);

        $this->info("Enum {$name} created successfully!");
    }
}

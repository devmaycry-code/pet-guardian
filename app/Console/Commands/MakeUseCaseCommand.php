<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeUseCaseCommand extends Command
{
    protected $signature = 'make:usecase
        {name : Ex: User}
        {--resource : Generate CRUD UseCases}
        {--transaction : Wrap execute in DB::transaction}';

    protected $description = 'Create UseCase classes';

    public function handle(): int
    {
        $input = str_replace('\\', '/', $this->argument('name'));
        $baseFolder = Str::studly($input);

        $namespace = "App\\UseCases\\{$baseFolder}";
        $dirPath = app_path("UseCases/{$baseFolder}");

        File::ensureDirectoryExists($dirPath);

        if ($this->option('resource')) {
            $this->generateCrudUseCases($baseFolder, $namespace, $dirPath);
        } else {
            $this->generateSingleUseCase($input);
        }

        return self::SUCCESS;
    }

    private function generateSingleUseCase(string $input): void
    {
        $baseName = basename($input);
        $folders = trim(dirname($input), '.');

        $className = Str::studly($baseName) . 'UseCase';
        $namespace = 'App\\UseCases' . ($folders ? '\\' . str_replace('/', '\\', Str::studly($folders)) : '');
        $dirPath = app_path('UseCases/' . $folders);

        File::ensureDirectoryExists($dirPath);

        $stub = $this->option('transaction')
            ? $this->getStub('usecase.transaction.stub')
            : $this->getStub('usecase.stub');

        $this->writeFile($dirPath, $className, $namespace, $stub);
    }

    private function generateCrudUseCases(string $entity, string $namespace, string $dirPath): void
    {
        $actions = [
            'Create' => 'create.usecase.stub',
            'Update' => 'update.usecase.stub',
            'Delete' => 'delete.usecase.stub',
            'Get' => 'get.usecase.stub',
            'List' => 'list.usecase.stub',
        ];

        foreach ($actions as $action => $stubFile) {
            $className = "{$action}{$entity}UseCase";
            $stub = $this->getStub($stubFile);

            if ($this->option('transaction')) {
                $stub = str_replace('{{ transaction }}', 'DB::transaction(function () {', $stub);
                $stub = str_replace('{{ endtransaction }}', '});', $stub);
            } else {
                $stub = str_replace(['{{ transaction }}', '{{ endtransaction }}'], '', $stub);
            }

            $this->writeFile($dirPath, $className, $namespace, $stub);
        }

        $this->info("CRUD UseCases generated for {$entity}");
    }

    private function writeFile(string $dir, string $class, string $namespace, string $stub): void
    {
        $file = "{$dir}/{$class}.php";

        if (File::exists($file)) {
            $this->warn("Skipped {$class}, already exists");
            return;
        }

        $stub = str_replace(
            ['{{ namespace }}', '{{ class }}'],
            [$namespace, $class],
            $stub
        );

        File::put($file, $stub);
        $this->info("Created {$class}");
    }

    private function getStub(string $file): string
    {
        return File::get(base_path("stubs/usecases/{$file}"));
    }
}

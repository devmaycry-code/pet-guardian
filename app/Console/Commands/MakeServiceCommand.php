<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class MakeServiceCommand extends Command
{
    protected $signature = 'make:service {name} {--resource : Create CRUD methods}';
    protected $description = 'Create a new service class';

    public function handle(): int
    {
        $name = $this->argument('name');
        $resource = $this->option('resource');

        $path = app_path("Services/{$name}.php");

        if (File::exists($path)) {
            $this->error('Service already exists!');
            return self::FAILURE;
        }

        File::ensureDirectoryExists(app_path('Services'));

        $stub = $resource ? $this->getResourceStub($name) : $this->getBasicStub($name);

        File::put($path, $stub);

        $this->info("Service {$name} created successfully.");
        return self::SUCCESS;
    }

    private function getBasicStub(string $name): string
    {
        return <<<PHP
                <?php

                namespace App\Services;

                class {$name}
                {
                    public function __construct() {}

                }
                PHP;
    }

    private function getResourceStub(string $name): string
    {
        $entity = str_replace('Service', '', $name);

        return <<<PHP
            <?php

            namespace App\Services;

            class {$name}
            {
                public function __construct() {}

                public function list{$entity}s(): array
                {
                    return [];
                }

                public function create{$entity}(array \$data)
                {
                    //
                }

                public function get{$entity}(int \$id)
                {
                    //
                }

                public function update{$entity}(int \$id, array \$data)
                {
                    //
                }

                public function delete{$entity}(int \$id): void
                {
                    //
                }
            }
            PHP;
    }
}

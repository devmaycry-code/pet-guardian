<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Organization;
use App\Models\Pet;
use App\Models\PetLetter;
use App\Models\PetNeed;
use App\Models\TemporaryHome;
use App\Models\TimelinePost;
use App\Models\TransparencyRecord;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin PetGuardian',
            'email' => 'admin@petguardian.local',
            'password' => Hash::make('password'),
            'role' => UserRole::ADMIN,
            'city' => 'Curitiba',
            'state' => 'PR',
            'verified_at' => now(),
            'trust_score' => 100,
        ]);

        $ongUser = User::create([
            'name' => 'Vivian Souza',
            'email' => 'ong@petguardian.local',
            'password' => Hash::make('password'),
            'role' => UserRole::ONG,
            'city' => 'Curitiba',
            'state' => 'PR',
            'verified_at' => now(),
            'trust_score' => 86,
        ]);

        $homeUser = User::create([
            'name' => 'Marina Rocha',
            'email' => 'lar@petguardian.local',
            'password' => Hash::make('password'),
            'role' => UserRole::TEMPORARY_HOME,
            'city' => 'Joinville',
            'state' => 'SC',
            'verified_at' => now(),
            'trust_score' => 74,
        ]);

        User::create([
            'name' => 'Lucas Pawdrinho',
            'email' => 'user@petguardian.local',
            'password' => Hash::make('password'),
            'role' => UserRole::USER,
            'city' => 'Sao Paulo',
            'state' => 'SP',
            'trust_score' => 20,
        ]);

        $ongs = collect([
            ['name' => 'Patinhas do Vale', 'slug' => 'patinhas-do-vale', 'city' => 'Curitiba', 'state' => 'PR'],
            ['name' => 'Casa Miaudota', 'slug' => 'casa-miaudota', 'city' => 'Sao Paulo', 'state' => 'SP'],
            ['name' => 'Abrigo Esperanca Animal', 'slug' => 'abrigo-esperanca-animal', 'city' => 'Florianopolis', 'state' => 'SC'],
        ])->map(fn (array $item) => Organization::create($item + [
            'user_id' => $ongUser->id,
            'description' => 'Organizacao verificada com historico publico de cuidado e prestacao de contas.',
            'email' => 'contato@petguardian.local',
            'verified' => true,
            'trust_score' => 85,
            'transparency_score' => 78,
        ]));

        $homes = collect([
            ['description' => 'Lar temporario para recuperacao pos-cirurgica.', 'capacity' => 4, 'available_slots' => 1, 'city' => 'Joinville', 'state' => 'SC'],
            ['description' => 'Lar temporario com foco em filhotes resgatados.', 'capacity' => 3, 'available_slots' => 2, 'city' => 'Curitiba', 'state' => 'PR'],
        ])->map(fn (array $item) => TemporaryHome::create($item + [
            'user_id' => $homeUser->id,
            'verified' => true,
            'trust_score' => 72,
        ]));

        $pets = collect([
            ['name' => 'Thor', 'slug' => 'thor', 'species' => 'dog', 'gender' => 'male', 'age' => '3 anos', 'size' => 'medio', 'urgency_level' => 'HIGH'],
            ['name' => 'Luna', 'slug' => 'luna', 'species' => 'cat', 'gender' => 'female', 'age' => '1 ano', 'size' => 'pequeno', 'urgency_level' => 'MEDIUM'],
            ['name' => 'Mel', 'slug' => 'mel', 'species' => 'dog', 'gender' => 'female', 'age' => '6 meses', 'size' => 'pequeno', 'urgency_level' => 'CRITICAL'],
            ['name' => 'Bento', 'slug' => 'bento', 'species' => 'dog', 'gender' => 'male', 'age' => '8 anos', 'size' => 'grande', 'urgency_level' => 'MEDIUM'],
            ['name' => 'Nina', 'slug' => 'nina', 'species' => 'cat', 'gender' => 'female', 'age' => '2 anos', 'size' => 'pequeno', 'urgency_level' => 'LOW'],
            ['name' => 'Fred', 'slug' => 'fred', 'species' => 'dog', 'gender' => 'male', 'age' => '5 anos', 'size' => 'medio', 'urgency_level' => 'HIGH'],
            ['name' => 'Amora', 'slug' => 'amora', 'species' => 'cat', 'gender' => 'female', 'age' => '4 meses', 'size' => 'pequeno', 'urgency_level' => 'MEDIUM'],
            ['name' => 'Zeca', 'slug' => 'zeca', 'species' => 'dog', 'gender' => 'male', 'age' => '10 anos', 'size' => 'medio', 'urgency_level' => 'CRITICAL'],
        ])->map(function (array $item, int $index) use ($ongs, $homes): Pet {
            return Pet::create($item + [
                'organization_id' => $ongs[$index % $ongs->count()]->id,
                'temporary_home_id' => $homes[$index % $homes->count()]->id,
                'status' => 'AVAILABLE',
                'story' => "Historia de {$item['name']} acompanhada pela rede PetGuardian.",
                'rescue_story' => "{$item['name']} foi resgatado e agora recebe cuidado com transparencia.",
                'avatar' => "/images/pets/{$item['slug']}.jpg",
                'city' => $ongs[$index % $ongs->count()]->city,
                'state' => $ongs[$index % $ongs->count()]->state,
                'verified' => true,
            ]);
        });

        foreach (range(1, 10) as $index) {
            PetNeed::create([
                'pet_id' => $pets[($index - 1) % $pets->count()]->id,
                'title' => "Necessidade {$index}",
                'description' => 'Cuidado rastreavel vinculado ao pet e a uma prestacao futura.',
                'type' => $index % 2 === 0 ? 'food' : 'medical',
                'goal_amount' => 100 + ($index * 35),
                'current_amount' => 20 * $index,
                'urgency_level' => $index % 3 === 0 ? 'HIGH' : 'MEDIUM',
                'status' => 'OPEN',
                'proof_required' => true,
            ]);

            TimelinePost::create([
                'pet_id' => $pets[($index - 1) % $pets->count()]->id,
                'user_id' => $admin->id,
                'title' => "Atualizacao {$index}",
                'content' => 'Registro publico para Pawdrinhos acompanharem a evolucao do pet.',
                'type' => 'UPDATE',
            ]);
        }

        foreach (range(1, 6) as $index) {
            PetLetter::create([
                'pet_id' => $pets[($index - 1) % $pets->count()]->id,
                'title' => "Cartinha {$index}",
                'content' => 'Obrigado por acompanhar minha jornada. Cada gesto ajuda meu cuidado.',
                'generated_by_ai' => false,
            ]);
        }

        foreach (range(1, 5) as $index) {
            TransparencyRecord::create([
                'organization_id' => $ongs[($index - 1) % $ongs->count()]->id,
                'pet_need_id' => PetNeed::query()->inRandomOrder()->value('id'),
                'title' => "Registro de transparencia {$index}",
                'description' => 'Lancamento publico de uso do recurso recebido.',
                'amount' => 80 + ($index * 45),
                'proof_file' => null,
            ]);
        }

        $pawdrinho = User::query()->where('email', 'user@petguardian.local')->first();

        if ($pawdrinho) {
            $followIds = array_values(array_filter([
                $pets->firstWhere('slug', 'luna')?->id,
                $pets->firstWhere('slug', 'nina')?->id,
                $pets->firstWhere('slug', 'cacau')?->id,
            ]));

            $pawdrinho->followedPets()->sync($followIds);
        }
    }
}

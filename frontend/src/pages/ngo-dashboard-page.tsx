import { useRef, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { StatCard } from '../components/stat-card';
import { useAuthStore } from '../features/auth/auth-store';
import { usePetStore } from '../features/pets/pet-store';
import { dashboardService } from '../services/dashboard-service';
import { roleLabels } from '../utils/access';
import { formatCurrency } from '../utils/format';

export function NgoDashboardPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { organizations, pets, needs, timelinePosts } = usePetStore();
  const managedOrganizationId = currentUser?.organizationId ?? currentUser?.temporaryHomeId;

  const organization = organizations.find((entry) => entry.id === managedOrganizationId);
  const organizationPets = pets.filter((entry) => entry.organizationId === organization?.id);
  const organizationNeeds = needs.filter((entry) =>
    organizationPets.some((pet) => pet.id === entry.petId),
  );
  const organizationPosts = timelinePosts.filter((entry) =>
    organizationPets.some((pet) => pet.id === entry.petId),
  );

  const totalRaised = organizationNeeds.reduce((sum, need) => sum + need.collectedAmount, 0);

  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<'dog' | 'cat'>('dog');
  const [petCity, setPetCity] = useState(currentUser?.city ?? '');
  const [petState, setPetState] = useState(currentUser?.state ?? '');
  const [petSummary, setPetSummary] = useState('');
  const [petStory, setPetStory] = useState('');
  const [petAvatarFile, setPetAvatarFile] = useState<File | null>(null);
  const petAvatarInputRef = useRef<HTMLInputElement>(null);

  const [needPetId, setNeedPetId] = useState(organizationPets[0]?.id ?? '');
  const [needTitle, setNeedTitle] = useState('');
  const [needDescription, setNeedDescription] = useState('');
  const [needAmount, setNeedAmount] = useState('0');

  const [timelinePetId, setTimelinePetId] = useState(organizationPets[0]?.id ?? '');
  const [timelineTitle, setTimelineTitle] = useState('');
  const [timelineContent, setTimelineContent] = useState('');

  const inputClassName =
    'h-12 rounded-2xl border border-brand-line px-4 outline-none focus:border-brand-sage';

  if (!currentUser) {
    return <Navigate replace to="/login" />;
  }

  if (!organization) {
    return <Navigate replace to="/" />;
  }

  const handleCreatePet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!organization) {
      return;
    }

    await dashboardService.createPet({
      name: petName,
      species: petSpecies,
      city: petCity,
      state: petState,
      summary: petSummary,
      story: petStory,
      organizationId: organization.id,
      avatarFile: petAvatarFile,
    });

    setPetName('');
    setPetSummary('');
    setPetStory('');
    setPetAvatarFile(null);
    if (petAvatarInputRef.current) {
      petAvatarInputRef.current.value = '';
    }
  };

  const handleCreateNeed = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await dashboardService.addNeed({
      petId: needPetId,
      title: needTitle,
      description: needDescription,
      estimatedAmount: Number(needAmount),
    });

    setNeedTitle('');
    setNeedDescription('');
    setNeedAmount('0');
  };

  const handleCreateTimeline = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await dashboardService.addTimelinePost({
      petId: timelinePetId,
      title: timelineTitle,
      content: timelineContent,
    });

    setTimelineTitle('');
    setTimelineContent('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-sage">
            Dashboard ONG
          </p>
          <h1 className="mt-3 font-display text-5xl text-brand-ink">
            {organization.name} em operacao
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-brand-muted">
            Painel para acompanhar pets, publicar atualizacoes e abrir novas necessidades usando a API em tempo real.
          </p>
          <p className="mt-3 text-sm text-brand-muted">
            Acesso atual: {roleLabels[currentUser.role]}. Esta area mostra apenas os pets vinculados a {organization.name}.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pets ativos" value={String(organizationPets.length)} tone="warm" />
        <StatCard label="Necessidades abertas" value={String(organizationNeeds.length)} tone="sky" />
        <StatCard label="Atualizacoes publicadas" value={String(organizationPosts.length)} tone="sage" />
        <StatCard label="Arrecadado rastreado" value={formatCurrency(totalRaised)} tone="warm" />
      </section>

      <section className="mt-12 grid gap-8 xl:grid-cols-3">
        <form
          className="space-y-4 rounded-[2rem] bg-white p-6"
          onSubmit={(event) => {
            void handleCreatePet(event);
          }}
        >
          <h2 className="font-display text-3xl text-brand-ink">Cadastrar pet</h2>
          <input
            className={`${inputClassName} w-full`}
            placeholder="Nome do pet"
            value={petName}
            onChange={(event) => setPetName(event.target.value)}
            required
          />
          <select
            className={`${inputClassName} w-full`}
            value={petSpecies}
            onChange={(event) => setPetSpecies(event.target.value as 'dog' | 'cat')}
          >
            <option value="dog">Cao</option>
            <option value="cat">Gato</option>
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className={`${inputClassName} w-full`}
              placeholder="Cidade"
              value={petCity}
              onChange={(event) => setPetCity(event.target.value)}
              required
            />
            <input
              className={`${inputClassName} w-full`}
              placeholder="Estado"
              value={petState}
              onChange={(event) => setPetState(event.target.value)}
              required
            />
          </div>
          <textarea
            className="min-h-24 w-full rounded-2xl border border-brand-line px-4 py-3 outline-none focus:border-brand-sage"
            placeholder="Resumo curto"
            value={petSummary}
            onChange={(event) => setPetSummary(event.target.value)}
            required
          />
          <textarea
            className="min-h-32 w-full rounded-2xl border border-brand-line px-4 py-3 outline-none focus:border-brand-sage"
            placeholder="Historia do pet"
            value={petStory}
            onChange={(event) => setPetStory(event.target.value)}
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-brand-ink" htmlFor="pet-avatar-file">
              Foto do pet
            </label>
            <input
              ref={petAvatarInputRef}
              className={`${inputClassName} w-full py-2`}
              id="pet-avatar-file"
              accept="image/*"
              type="file"
              onChange={(event) => setPetAvatarFile(event.target.files?.[0] ?? null)}
            />
            <p className="text-xs leading-5 text-brand-muted">
              Se você enviar uma imagem, ela será armazenada no backend e otimizada em segundo plano.
            </p>
          </div>
          <button
            className="rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-strong"
            type="submit"
          >
            Publicar novo pet
          </button>
        </form>

        <form
          className="space-y-4 rounded-[2rem] bg-white p-6"
          onSubmit={(event) => {
            void handleCreateNeed(event);
          }}
        >
          <h2 className="font-display text-3xl text-brand-ink">Nova necessidade</h2>
          <select
            className={`${inputClassName} w-full`}
            value={needPetId}
            onChange={(event) => setNeedPetId(event.target.value)}
          >
            {organizationPets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
          <input
            className={`${inputClassName} w-full`}
            placeholder="Titulo da necessidade"
            value={needTitle}
            onChange={(event) => setNeedTitle(event.target.value)}
            required
          />
          <textarea
            className="min-h-28 w-full rounded-2xl border border-brand-line px-4 py-3 outline-none focus:border-brand-sage"
            placeholder="Descricao do que sera custeado"
            value={needDescription}
            onChange={(event) => setNeedDescription(event.target.value)}
            required
          />
          <input
            className={`${inputClassName} w-full`}
            min="0"
            placeholder="Valor estimado"
            type="number"
            value={needAmount}
            onChange={(event) => setNeedAmount(event.target.value)}
            required
          />
          <button
            className="rounded-full bg-brand-sage px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-sage-strong"
            type="submit"
          >
            Criar necessidade
          </button>
        </form>

        <form
          className="space-y-4 rounded-[2rem] bg-white p-6"
          onSubmit={(event) => {
            void handleCreateTimeline(event);
          }}
        >
          <h2 className="font-display text-3xl text-brand-ink">Publicar atualizacao</h2>
          <select
            className={`${inputClassName} w-full`}
            value={timelinePetId}
            onChange={(event) => setTimelinePetId(event.target.value)}
          >
            {organizationPets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
          <input
            className={`${inputClassName} w-full`}
            placeholder="Titulo da atualizacao"
            value={timelineTitle}
            onChange={(event) => setTimelineTitle(event.target.value)}
            required
          />
          <textarea
            className="min-h-40 w-full rounded-2xl border border-brand-line px-4 py-3 outline-none focus:border-brand-sage"
            placeholder="Conte o que mudou na jornada do pet"
            value={timelineContent}
            onChange={(event) => setTimelineContent(event.target.value)}
            required
          />
          <button
            className="rounded-full bg-brand-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-sky-strong"
            type="submit"
          >
            Publicar timeline
          </button>
        </form>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-white p-6">
          <h2 className="font-display text-3xl text-brand-ink">Pets da organizacao</h2>
          <div className="mt-5 grid gap-4">
            {organizationPets.map((pet) => (
              <article key={pet.id} className="rounded-[1.5rem] bg-brand-panel p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl text-brand-ink">{pet.name}</h3>
                    <p className="text-sm text-brand-muted">
                      {pet.city}, {pet.state}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-orange-soft px-3 py-1 text-xs font-semibold text-brand-orange-strong">
                    {pet.sponsorCount} Pawdrinhos
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-brand-muted">{pet.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6">
          <h2 className="font-display text-3xl text-brand-ink">Necessidades recentes</h2>
          <div className="mt-5 space-y-4">
            {organizationNeeds.slice(0, 6).map((need) => (
              <article key={need.id} className="rounded-[1.5rem] bg-brand-panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-brand-ink">{need.title}</h3>
                  <span className="text-sm font-semibold text-brand-sage-strong">
                    {formatCurrency(need.collectedAmount)} / {formatCurrency(need.estimatedAmount)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-brand-muted">{need.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

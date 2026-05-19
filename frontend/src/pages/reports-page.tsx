import { useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../features/auth/auth-store';
import { usePetStore } from '../features/pets/pet-store';
import { reportsService } from '../services/reports-service';
import type { ReportReason } from '../types/domain';

const reasons: { value: ReportReason; label: string }[] = [
  { value: 'fake_pet', label: 'Pet suspeito' },
  { value: 'suspicious_image', label: 'Imagem suspeita' },
  { value: 'fake_campaign', label: 'Campanha suspeita' },
  { value: 'mistreatment', label: 'Maus-tratos' },
  { value: 'missing_accountability', label: 'Falta de prestacao de contas' },
  { value: 'misuse_of_money', label: 'Uso indevido de dinheiro' },
  { value: 'duplicate_profile', label: 'Perfil duplicado' },
];

export function ReportsPage() {
  const [searchParams] = useSearchParams();
  const currentUser = useAuthStore((state) => state.currentUser);
  const pets = usePetStore((state) => state.pets);
  const reports = usePetStore((state) => state.reports);
  const petIdFromQuery = searchParams.get('petId') ?? '';

  const [petId, setPetId] = useState(petIdFromQuery);
  const [reason, setReason] = useState<ReportReason>('missing_accountability');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedPetName = useMemo(
    () =>
      pets.find((pet) => pet.id === petId || pet.remoteId === petId)?.name ??
      'um pet da plataforma',
    [petId, pets],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await reportsService.create({
      petId: petId || undefined,
      reporterName: currentUser?.name ?? 'Visitante identificado',
      reason,
      description,
    });

    setDescription('');
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-sage">
            Canal de denuncia
          </p>
          <h1 className="font-display text-5xl text-brand-ink">Quando algo parecer errado, o caminho precisa ser simples.</h1>
          <p className="text-lg leading-8 text-brand-muted">
            Denuncias ajudam a proteger os pets e a comunidade. O objetivo aqui e facilitar o alerta, nao criar atrito.
          </p>
          <div className="rounded-[2rem] bg-white p-6">
            <p className="text-sm text-brand-muted">Se voce chegou por um perfil especifico</p>
            <p className="mt-2 font-display text-3xl text-brand-ink">{selectedPetName}</p>
          </div>
        </div>

        <form
          className="space-y-4 rounded-[2.25rem] bg-white p-6 shadow-[0_18px_45px_rgba(117,97,70,0.08)]"
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-brand-ink">Pet relacionado</span>
            <select
              className="h-12 w-full rounded-2xl border border-brand-line px-4 outline-none focus:border-brand-sage"
              value={petId}
              onChange={(event) => setPetId(event.target.value)}
            >
              <option value="">Selecionar depois</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-brand-ink">Motivo</span>
            <select
              className="h-12 w-full rounded-2xl border border-brand-line px-4 outline-none focus:border-brand-sage"
              value={reason}
              onChange={(event) => setReason(event.target.value as ReportReason)}
            >
              {reasons.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-brand-ink">Descricao</span>
            <textarea
              className="min-h-40 w-full rounded-2xl border border-brand-line px-4 py-3 outline-none focus:border-brand-sage"
              placeholder="Descreva o que voce observou e por que a denuncia deve ser revisada."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </label>

          <button
            className="rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-strong"
            type="submit"
          >
            Enviar denuncia
          </button>

          {submitted ? (
            <div className="rounded-[1.5rem] bg-brand-sage-soft p-4 text-sm leading-6 text-brand-sage-strong">
              Denuncia enviada com sucesso. No MVP, ela entra na fila local ou na API quando ha sessao ativa.
            </div>
          ) : null}
        </form>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl text-brand-ink">Fila recente</h2>
        <div className="mt-6 grid gap-4">
          {reports.map((report) => (
            <article key={report.id} className="rounded-[1.75rem] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-ink">{report.reason}</p>
                  <p className="text-sm text-brand-muted">{report.reporterName}</p>
                </div>
                <span className="rounded-full bg-brand-sky-soft px-3 py-1 text-xs font-semibold text-brand-sky-strong">
                  {report.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-brand-muted">{report.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

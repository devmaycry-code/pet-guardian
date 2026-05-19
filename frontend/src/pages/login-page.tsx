import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessSummaryCard } from '../components/access-summary-card';
import { authService } from '../services/auth-service';
import type { User } from '../types/domain';
import { roleCapabilities, roleLabels } from '../utils/access';

export function LoginPage() {
  const navigate = useNavigate();
  const initialProfiles = authService.listProfiles();
  const [profiles] = useState<User[]>(initialProfiles);
  const [selectedProfileId, setSelectedProfileId] = useState(initialProfiles[0]?.id ?? '');
  const [loading, setLoading] = useState(false);

  const selectedProfile =
    profiles.find((profile) => profile.id === selectedProfileId) ?? null;

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const user = await authService.loginWithSelectedProfile(selectedProfileId);
    setLoading(false);

    void navigate(user?.organizationId ? '/ngo/dashboard' : '/pets');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <section className="mx-auto grid w-full max-w-5xl gap-8 rounded-[2.5rem] bg-white p-6 shadow-[0_22px_55px_rgba(117,97,70,0.1)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <div className="rounded-[2rem] bg-[linear-gradient(160deg,#ffe3cf_0%,#fbf4eb_55%,#ddf1fb_100%)] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-sage">
            Acesso demo
          </p>
          <h1 className="mt-4 font-display text-4xl text-brand-ink">Entre como Pawdrinho, ONG ou lar temporario.</h1>
          <p className="mt-4 text-sm leading-7 text-brand-muted">
            Este MVP usa perfis pre-carregados para validar navegacao, estados protegidos e a autenticacao real do backend sem perder o fluxo local.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            void handleLogin(event);
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-brand-ink">Perfil disponivel</span>
            <select
              className="h-12 w-full rounded-2xl border border-brand-line px-4 outline-none focus:border-brand-sage"
              value={selectedProfileId}
              onChange={(event) => setSelectedProfileId(event.target.value)}
            >
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name} - {profile.role}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-[1.75rem] bg-brand-panel p-5 text-sm leading-6 text-brand-muted">
            {selectedProfile
              ? `Este perfil entra como ${roleLabels[selectedProfile.role]} e pode acessar apenas as areas correspondentes a essa responsabilidade.`
              : 'Selecione um perfil para ver as permissoes deste acesso.'}
          </div>

          <div className="rounded-[1.75rem] border border-brand-line bg-white p-5 text-sm leading-6 text-brand-muted">
            Seguir pets e um gesto de acompanhamento. Apadrinhar continua sendo a camada de ajuda direta, pensada para converter afeto em cuidado real.
          </div>

          {selectedProfile ? (
            <div className="space-y-2 rounded-[1.75rem] border border-brand-line bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-sage">
                Quem pode ver o que
              </p>
              {roleCapabilities[selectedProfile.role].map((capability) => (
                <p key={capability} className="text-sm leading-6 text-brand-muted">
                  {capability}
                </p>
              ))}
            </div>
          ) : null}

          <button
            className="rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-strong disabled:opacity-60"
            disabled={loading || !selectedProfileId}
            type="submit"
          >
            {loading ? 'Entrando...' : 'Entrar com este perfil'}
          </button>
        </form>
      </section>
      <div className="mx-auto mt-8 grid w-full max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AccessSummaryCard title="Area publica" role="visitor" />
        <AccessSummaryCard title="Acesso afetivo" role="pawdrinho" />
        <AccessSummaryCard title="Acesso gestor" role="ngo_manager" />
      </div>
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessSummaryCard } from '../components/access-summary-card';
import { authService } from '../services/auth-service';
import { roleCapabilities, roleLabels } from '../utils/access';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await authService.login({ email, password });
      void navigate(user?.organizationId || user?.temporaryHomeId ? '/ngo/dashboard' : '/pets');
    } catch {
      setError('Nao foi possivel autenticar com essas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <section className="mx-auto grid w-full max-w-5xl gap-8 rounded-[2.5rem] bg-white p-6 shadow-[0_22px_55px_rgba(117,97,70,0.1)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <div className="rounded-[2rem] bg-[linear-gradient(160deg,#ffe3cf_0%,#fbf4eb_55%,#ddf1fb_100%)] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-sage">
            Acesso autenticado
          </p>
          <h1 className="mt-4 font-display text-4xl text-brand-ink">
            Entre com sua conta para acompanhar, apoiar ou gerir casos.
          </h1>
          <p className="mt-4 text-sm leading-7 text-brand-muted">
            Esta tela usa apenas a API Laravel. O fluxo demo por perfil fixo foi removido.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            void handleLogin(event);
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-brand-ink">Email</span>
            <input
              className="h-12 w-full rounded-2xl border border-brand-line px-4 outline-none focus:border-brand-sage"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-brand-ink">Senha</span>
            <input
              className="h-12 w-full rounded-2xl border border-brand-line px-4 outline-none focus:border-brand-sage"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <div className="rounded-[1.75rem] border border-brand-line bg-white p-5 text-sm leading-6 text-brand-muted">
            Depois do login, a aplicacao hidrata a sessao com `GET /api/auth/me` e libera apenas
            as areas compatíveis com o papel retornado pela API.
          </div>

          {error ? (
            <div className="rounded-[1.5rem] bg-rose-50 p-4 text-sm leading-6 text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            className="rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-strong disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
      <div className="mx-auto mt-8 grid w-full max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AccessSummaryCard title="Area publica" role="pawdrinho" />
        <AccessSummaryCard title="Gestao ONG" role="ngo_manager" />
        <AccessSummaryCard title="Lar temporario" role="temporary_home_manager" />
      </div>
      <section className="mx-auto mt-8 max-w-5xl rounded-[2rem] bg-white p-6">
        <h2 className="font-display text-3xl text-brand-ink">Permissoes por papel</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {Object.entries(roleCapabilities).map(([role, capabilities]) => (
            <article key={role} className="rounded-[1.5rem] bg-brand-panel p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-sage">
                {roleLabels[role as keyof typeof roleLabels]}
              </p>
              <div className="mt-3 space-y-2">
                {capabilities.map((capability) => (
                  <p key={capability} className="text-sm leading-6 text-brand-muted">
                    {capability}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

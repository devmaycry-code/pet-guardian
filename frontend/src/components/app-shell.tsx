import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/auth-store';
import { authService } from '../services/auth-service';
import { canAccessNgoDashboard, roleLabels } from '../utils/access';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/pets', label: 'Pets' },
  { to: '/apoios', label: 'Apoios' },
  { to: '/transparency', label: 'Transparencia' },
  { to: '/reports', label: 'Denuncias' },
];

export function AppShell() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = () => {
    void authService.logout();
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink">
      <header className="sticky top-0 z-20 border-b border-white/80 bg-brand-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link className="flex items-center gap-3" to="/">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-xl text-white">
              PG
            </div>
            <div>
              <p className="font-display text-2xl">PetGuardian</p>
              <p className="text-sm text-brand-muted">Cuidado coletivo com transparencia</p>
            </div>
          </Link>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-ink text-white'
                      : 'bg-white text-brand-ink hover:bg-brand-orange-soft'
                  }`
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
            {currentUser ? (
              <NavLink
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-sky-strong text-white'
                      : 'bg-white text-brand-ink hover:bg-brand-sky-soft'
                  }`
                }
                to="/following"
              >
                Seguindo
              </NavLink>
            ) : null}
            {canAccessNgoDashboard(currentUser) ? (
              <NavLink
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-sage text-white'
                      : 'bg-brand-sage-soft text-brand-sage-strong hover:bg-brand-sage hover:text-white'
                  }`
                }
                to="/ngo/dashboard"
              >
                Area gestora
              </NavLink>
            ) : null}
          </nav>
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-sky-soft text-sm font-semibold text-brand-sky-strong">
                    {currentUser.avatar}
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold">{currentUser.name}</p>
                    <p className="text-brand-muted">{roleLabels[currentUser.role]}</p>
                  </div>
                </div>
                <button
                  className="rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-panel"
                  onClick={logout}
                  type="button"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                className="rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange-strong"
                to="/login"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-white/80 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-2xl text-brand-ink">Toda patinha merece um guardiao.</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
              O PetGuardian existe para que qualquer pessoa possa proteger uma vida, mesmo sem levar essa vida para casa.
            </p>
          </div>
          <div className="text-sm text-brand-muted">
            MVP open source API-first com fallback local explicito e integracao com API Laravel.
          </div>
        </div>
      </footer>
    </div>
  );
}

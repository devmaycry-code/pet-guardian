import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { authService } from '../services/auth-service';
import { publicCatalogService } from '../services/public-catalog-service';
import { router } from './router';

export function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        await publicCatalogService.sync();
        await authService.restoreSession();
        if (!cancelled) {
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setError('Nao foi possivel carregar o catalogo publico.');
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4 text-center text-brand-muted">
        {error}
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4 text-brand-muted">
        Carregando catalogo...
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

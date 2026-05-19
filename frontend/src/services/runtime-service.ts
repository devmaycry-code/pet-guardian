import { useRuntimeStore } from '../features/runtime/runtime-store';
import { publicHttp } from './http';

type ApiEnvelope<T> = {
  result?: T;
};

type ApiRuntime = {
  environment?: string;
  payment_simulation_enabled?: boolean;
  stripe_test_mode?: boolean;
};

export const runtimeService = {
  async load() {
    try {
      const response = await publicHttp.get<ApiEnvelope<ApiRuntime>>('/runtime');
      const payload = response.data?.result;

      if (payload) {
        useRuntimeStore.getState().setRuntime({
          environment: payload.environment ?? 'local',
          paymentSimulationEnabled: Boolean(payload.payment_simulation_enabled),
          stripeTestMode: Boolean(payload.stripe_test_mode),
        });
      }
    } catch {
      // Keep default local runtime flags.
    }
  },
};

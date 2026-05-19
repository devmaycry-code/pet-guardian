import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RuntimeState {
  environment: string;
  paymentSimulationEnabled: boolean;
  stripeTestMode: boolean;
  setRuntime: (payload: {
    environment: string;
    paymentSimulationEnabled: boolean;
    stripeTestMode: boolean;
  }) => void;
}

export const useRuntimeStore = create<RuntimeState>()(
  persist(
    (set) => ({
      environment: 'local',
      paymentSimulationEnabled: false,
      stripeTestMode: false,
      setRuntime: (payload) =>
        set({
          environment: payload.environment,
          paymentSimulationEnabled: payload.paymentSimulationEnabled,
          stripeTestMode: payload.stripeTestMode,
        }),
    }),
    {
      name: 'petguardian-runtime',
      partialize: (state) => ({
        environment: state.environment,
        paymentSimulationEnabled: state.paymentSimulationEnabled,
        stripeTestMode: state.stripeTestMode,
      }),
    },
  ),
);

// src/components/TonConnectProvider.tsx
"use client";

import { ReactNode } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

interface TonConnectProviderProps {
  children: ReactNode;
}

const TonConnectProvider = ({ children }: TonConnectProviderProps) => {
  return (
    <TonConnectUIProvider actionsConfiguration={{ returnStrategy: 'back', twaReturnUrl: 'https://happy-lottery.com' }} manifestUrl="https://raw.githubusercontent.com/kartafil/ton-jackpot/main/manifest.json">
      {children}
    </TonConnectUIProvider>
  );
};

export default TonConnectProvider;

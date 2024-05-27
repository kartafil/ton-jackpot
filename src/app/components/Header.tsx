// src/components/Header.tsx
import React from 'react';
import ConnectButton from './ConnectButton';
import { TonConnectButton } from '@tonconnect/ui-react';

const Header = () => {
  return (
    <header className="header bg-zinc-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">Happy-Lottery ||:{'>'} TON</h1>
      <TonConnectButton />
    </header>
  );
};

export default Header;

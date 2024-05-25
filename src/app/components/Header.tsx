// src/components/Header.tsx
import React from 'react';
import ConnectButton from './ConnectButton';

const Header = () => {
  return (
    <header className="header bg-zinc-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">Happy-Lottery ||:{'>'} TON</h1>
      <ConnectButton />
    </header>
  );
};

export default Header;

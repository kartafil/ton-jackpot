// src/components/ConnectButton.tsx
"use client";

import React from 'react';
import { Address } from 'ton';
import { useTonConnectUI, useTonConnectModal, useTonWallet } from '@tonconnect/ui-react';
import { shortenAddress } from '@/utils';

const ConnectButton = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { open } = useTonConnectModal();
  const wallet = useTonWallet();

  const handleConnect = () => {
    open(); // Open the wallet selection modal
  };

  const handleDisconnect = () => {
    tonConnectUI.disconnect(); // Disconnect the wallet
  };

  return (
    <div>
      {wallet ? (
        <button onClick={handleDisconnect} className="bg-zinc-500 text-white px-4 py-2 rounded">
          Disconnect ({shortenAddress(Address.parse(wallet.account.address).toString())})
        </button>
      ) : (
        <button onClick={handleConnect} className="bg-zinc-500 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectButton;

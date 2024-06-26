import React, { useState } from 'react';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { Address, Cell, beginCell, toNano } from 'ton';
import { LOTTERY_MASTER_CA, CREATE_LOTTERY_OP } from '@/const';

const LotteryForm = () => {
  const [minimalBet, setMinimalBet] = useState(5);
  const [targetTotalBet, setTargetTotalBet] = useState(50);
  const [lotteryDuration, setLotteryDuration] = useState(2);
  const [contractAddress, setContractAddress] = useState("");
  const [nftAddress, setNftAddress] = useState("");

  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const handleCreateLottery = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }

    sendCreateLottery();
  };

  const sendCreateLottery = async () => {
    try {
      let durationInSeconds = lotteryDuration * 86400;

      const message = beginCell()
        .storeUint(CREATE_LOTTERY_OP, 32)
        .storeUint(0, 64)
        .storeAddress(null)
        .storeCoins(toNano(targetTotalBet.toString()))
        .storeCoins(toNano(minimalBet.toString()))
        .storeUint(durationInSeconds, 32)
        .endCell();

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: LOTTERY_MASTER_CA,
            amount: toNano('0.15').toString(),
            payload: message.toBoc().toString('base64')
          }
        ]
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      console.log('Transaction result:', result);
      alert('Transaction sent successfully');
    } catch (error) {
      console.error('Failed to send transaction:', error);
      alert('Failed to send transaction');
    }
  };

  const handleStartLottery = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting lottery with contract address:", contractAddress, "and NFT address:", nftAddress);
    sendNftToLottery();
  };

  const sendNftToLottery = async () => {
    try {
      const message = beginCell()
        .storeUint(0x5fcc3d14, 32)
        .storeUint(0, 64)
        .storeAddress(Address.parse(contractAddress))
        .storeAddress(Address.parse(wallet?.account.address!))
        .storeMaybeRef(null)
        .storeCoins(toNano('0.01'))
        .storeStringTail('Launch Lottery')
        .endCell();

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: nftAddress,
            amount: toNano('0.1').toString(),
            payload: message.toBoc().toString('base64')
          }
        ]
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      console.log('Transaction result:', JSON.stringify(result, null, 4));
      alert('Transaction sent successfully');
    } catch (error) {
      console.error('Failed to send transaction:', error);
      alert('Failed to send transaction');
    }
  };

  return (
    <div className="mt-8 mb-5 w-full max-w-5xl p-6 bg-zinc-800 rounded-lg text-white">
      <h2 className="text-3xl font-semibold mb-4">Создать новую лотерею:</h2>
      <form onSubmit={handleCreateLottery} className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold">1. Создайте контракт лотереи</legend>
          <div className="flex flex-col">
            <label htmlFor="targetTotalBet" className="mb-2">Цель по ставкам:</label>
            <input
              type="number"
              id="targetTotalBet"
              className="border border-gray-300 p-2 rounded text-black"
              value={targetTotalBet}
              onChange={(e) => setTargetTotalBet(Number(e.target.value))}
              min="1"
              step="0.1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="minimalBet" className="mb-2">Минимальная ставка:</label>
            <input
              type="number"
              id="minimalBet"
              className="border border-gray-300 p-2 rounded text-black"
              value={minimalBet}
              onChange={(e) => setMinimalBet(Number(e.target.value))}
              min="0.2"
              step="0.01"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lotteryDuration" className="mb-2">Продолжительность лотереи: {'(в днях)'}</label>
            <input
              type="number"
              id="lotteryDuration"
              className="border border-gray-300 p-2 rounded text-black"
              value={lotteryDuration}
              onChange={(e) => setLotteryDuration(Number(e.target.value))}
              min="1" max="7"
            />
          </div>
          <button type="submit" className="mt-4 bg-cyan-800 text-white px-4 py-2 rounded">
            Создать Лотерею
          </button>
        </fieldset>
      </form>
      <form onSubmit={handleStartLottery} className="mt-8 space-y-8">
        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold">2. Запустите лотерею, отправив на нее NFT</legend>
          <div className="flex flex-col">
            <label htmlFor="contractAddress" className="mb-2">Адрес контракта лотереи:</label>
            <input
              type="text"
              id="contractAddress"
              className="border border-gray-300 p-2 rounded text-black"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="nftAddress" className="mb-2">Адрес NFT, которое будет разыграно:</label>
            <input
              type="text"
              id="nftAddress"
              className="border border-gray-300 p-2 rounded text-black"
              value={nftAddress} 
              onChange={(e) => setNftAddress(e.target.value)}
            />
          </div>
          <button type="submit" className="mt-4 bg-cyan-800 text-white px-4 py-2 rounded">
            Запустить лотерею
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default LotteryForm;
// src/components/LotteryCard.tsx

import React, { useState } from 'react';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { Cell, beginCell, toNano } from 'ton';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { shortenAddress } from '@/utils';
import { copyButton } from './svg/buttons';
import Popup from './Popup'; // Import the Popup component

dayjs.extend(relativeTime);

interface LotteryCardProps {
  lottery: {
    address: string;
    id: string;
    isRefunded: boolean;
    isFinished: boolean;
    creator: string;
    winner: string;
    goalPrice: string;
    totalBets: string;
    minBet: string;
    nft_address: string;
    nft_name: string;
    duration: string;
    deadline: string;
    nft_preview: string;
  };
}

type PopupMessage = {
  message: string;
  isError: boolean;
};

const formatTON = (amount: string) => {
  const result = Number(BigInt(amount)) / 1e9;
  return result.toFixed(2);
};

const LotteryCard: React.FC<LotteryCardProps> = ({ lottery }) => {
  const [betAmount, setBetAmount] = useState(formatTON(lottery.minBet.toString()));
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<PopupMessage | null>(null);

  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const message = beginCell()
    .storeUint(0, 32)
    .storeBuffer(Buffer.from('bet', 'utf-8'))
    .endCell();

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  const handleBetSubmit = async () => {
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // valid for 60 seconds
      messages: [
        {
          address: lottery.address,
          amount: toNano(betAmount).toString(), // amount in nanoTONs
          payload: message.toBoc().toString('base64') // serialized message
        }
      ]
    };
    try {
      const result = await tonConnectUI.sendTransaction(transaction);
      setPopupMessage({ message: 'Bet success!', isError: false });
    } catch {
      setPopupMessage({ message: 'Bet canceled', isError: true });
    }
  };

  const progressPercentage = (totalBets: string, goalPrice: string) => {
    const total = Number(BigInt(totalBets)) / 1e9;
    const goal = Number(BigInt(goalPrice)) / 1e9;
    return total >= goal ? 100 : (total / goal) * 100;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddress(text);
      setTimeout(() => {
        setCopiedAddress(null);
      }, 1000);
    });
  };

  const progressBarColor = lottery.isFinished ? 'bg-emerald-700' : 'bg-cyan-600';

  const renderAddress = (label: string, address: string | null, url: string) => (
    <div className="relative mb-2">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-500 blur-text">
        {label}: {shortenAddress(address || 'N/A')}
      </a>
      <button
        onClick={() => handleCopy(address || 'N/A')}
        className="copy-button"
      >
        {copiedAddress === address ? '✔' : copyButton}
      </button>
    </div>
  );

  const isAvailable = !lottery.isFinished && dayjs.unix(parseInt(lottery.deadline, 10)).isAfter(dayjs());

  return (
    <div className="group rounded-lg place-self-start border border-transparent p-5 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30 cursor-pointer w-80">
      <h3 className="mb-3 text-xl text-teal-800 font-semibold">Lottery #{lottery.id}</h3>
      {lottery.nft_address && (
        <>
          <a href={`https://getgems.io/nft/${lottery.nft_address}`} target="_blank" rel="noopener noreferrer">
            <img src={lottery.nft_preview} alt="nft_image" className="w-full mb-1" />
          </a>
          <p className="m-0 mb-2 max-w-[30ch] text-xl opacity-70 truncate">{lottery.nft_name || 'N/A'}</p>
        </>
      )}
      {renderAddress('Lottery', lottery.address, `https://tonviewer.com/${lottery.address}`)}
      {lottery.nft_address && renderAddress('NFT', lottery.nft_address, `https://getgems.io/nft/${lottery.nft_address || 'N/A'}`)}
      {renderAddress('Creator', lottery.creator, `https://tonviewer.com/${lottery.creator}`)}
      {lottery.winner && renderAddress('Winner', lottery.winner, `https://tonviewer.com/${lottery.winner || ''}`)}
      <p className="m-0 max-w-[30ch] text-sm opacity-70">Min. bet: {formatTON(lottery.minBet)} TON</p>
      <p className="m-0 max-w-[30ch] text-sm opacity-70">Total bets: {formatTON(lottery.totalBets)} TON</p>
      <p className="m-0 max-w-[30ch] text-sm opacity-70">Goal: {formatTON(lottery.goalPrice)} TON</p>
      {isAvailable
        ?<p className="m-0 max-w-[30ch] text-sm opacity-70">Ends in: {dayjs.unix(parseInt(lottery.deadline, 10)).fromNow(true)}</p>
        : !lottery.nft_address && <p className="m-0 max-w-[30ch] text-sm opacity-70">Duration: {(+lottery.duration / 3600).toFixed(2) + ' h.'}</p>
      }
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 dark:bg-gray-700">
        <div className={`h-2.5 rounded-full ${progressBarColor}`} style={{ width: `${progressPercentage(lottery.totalBets, lottery.goalPrice)}%` }}></div>
      </div>
      {isAvailable && (
        <div className="mt-4">
          <label htmlFor={`bet-${lottery.id}`} className="block mb-2">Enter your bet:</label>
          <input
            type="number"
            id={`bet-${lottery.id}`}
            value={betAmount}
            onChange={handleBetChange}
            min={formatTON(lottery.minBet)}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <button onClick={handleBetSubmit} className="mt-2 bg-cyan-700 text-white p-2 w-full rounded">Bet</button>
        </div>
      )}
      {(lottery.isFinished || lottery.isRefunded) && <div className="ml-0 max-w-[30ch] text-sm opacity-70">{lottery.isFinished ? 'FINISHED' : 'REFUNDED'}</div>}
      {popupMessage && <Popup isError={popupMessage.isError} message={popupMessage.message} onClose={() => setPopupMessage(null)} />}
    </div>
  );
};

export default LotteryCard;

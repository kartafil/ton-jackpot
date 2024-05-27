// src/components/LotteryGrid.tsx

import React, { useEffect, useState, useRef } from 'react';
import LotteryCard from './LotteryCard';
import { getLotteryContractAddresses, getLotteryInfo, getNftPreview, getLocalLotteryInfo, getDfcLotteryContractAddresses, getLocalDfcLotteryInfo } from '../../services/tonClientService';

const LotteryGrid = () => {
  const [lotteries, setLotteries] = useState<any[]>([]);
  const [dfcLotteries, setDfcLotteries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLocalLoaded, setLocalLoaded] = useState(false);
  const [isDfcLocalLoaded, setDfcLocalLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isDfc, setIsDfc] = useState<boolean>(false); // State to track the type of lotteries being loaded

  const LOAD_STEP = 10;
  const isFetching = useRef<boolean>(false); // Ref to track fetching state

  const loadMoreLotteries = async () => {
    if (loading || isFetching.current) return; // Prevent multiple calls
    setLoading(true);
    isFetching.current = true; // Set fetching state

    try {
      const addresses = isDfc
        ? await getDfcLotteryContractAddresses(LOAD_STEP)
        : await getLotteryContractAddresses(LOAD_STEP);

      if (addresses.length > 0) {
        const newLotteries = [] as any[];

        for (const address of addresses) {
          const lottery = await getLotteryInfo(address);
          if (lottery.nft_address) {
            const nft_info = await getNftPreview(lottery.nft_address);
            lottery.nft_preview = nft_info.url;
            lottery.nft_name = nft_info.name;
          }
          newLotteries.push(lottery);
        }

        if (isDfc) {
          setDfcLotteries(prev => [...prev, ...newLotteries]);
        } else {
          setLotteries(prev => [...prev, ...newLotteries]);
        }
        setLoadedCount(prev => prev + newLotteries.length);

        if (newLotteries.length < 3) {
          const localLotteries = isDfc ? await getLocalDfcLotteryInfo() : await getLocalLotteryInfo();
          if (isDfc) {
            setDfcLotteries(prev => [...prev, ...localLotteries]);
            setDfcLocalLoaded(true);
          } else {
            setLotteries(prev => [...prev, ...localLotteries]);
            setLocalLoaded(true);
          }
          setLoadedCount(prev => prev + localLotteries.length);
        }
      } else if (!(isDfc ? isDfcLocalLoaded : isLocalLoaded)) {
        if (isDfc) {
          setDfcLocalLoaded(true);
          const localLotteries = await getLocalDfcLotteryInfo();
          setDfcLotteries(prev => [...prev, ...localLotteries]);
          setLoadedCount(prev => prev + localLotteries.length);
        } else {
          setLocalLoaded(true);
          const localLotteries = await getLocalLotteryInfo();
          setLotteries(prev => [...prev, ...localLotteries]);
          setLoadedCount(prev => prev + localLotteries.length);
        }
      }
    } catch (error) {
      console.error('Error fetching lotteries:', error);
      setError('Error fetching lotteries');
    } finally {
      setLoading(false);
      isFetching.current = false; // Reset fetching state
    }
  };

  useEffect(() => {
    if (isDfc ? dfcLotteries.length === 0 : lotteries.length === 0) {
      loadMoreLotteries();
    }
  }, [isDfc]); // Re-fetch when switching between regular and DFC lotteries

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-center mb-4">
        <button
          className={`mx-2 px-4 py-2 rounded ${!isDfc ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsDfc(false)}
        >
          Regular Lotteries
        </button>
        <button
          className={`mx-2 px-4 py-2 rounded ${isDfc ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsDfc(true)}
        >
          DFC Lotteries
        </button>
      </div>
      <div className="jackpot-grid mt-8">
        {(isDfc ? dfcLotteries : lotteries).map((lottery, index) => (
          <LotteryCard key={index} lottery={lottery} />
        ))}
      </div>
      {!(isDfc ? isDfcLocalLoaded : isLocalLoaded) && (
        <button
          onClick={loadMoreLotteries}
          disabled={loading}
          className="mt-4 bg-emerald-400 w-full text-white px-4 py-2 rounded"
        >
          {loading ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
};

export default LotteryGrid;

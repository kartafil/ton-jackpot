// src/components/LotteryGrid.tsx

import React, { useEffect, useState, useRef } from 'react';
import LotteryCard from './LotteryCard';
import { getLotteryContractAddresses, getLotteryInfo, getNftPreview, getLocalLotteryInfo } from '../../services/tonClientService';

const LotteryGrid = () => {
  const [lotteries, setLotteries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLocalLoaded, setLocalLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  const LOAD_STEP = 20;
  const isFetching = useRef<boolean>(false); // Ref to track fetching state

  const loadMoreLotteries = async () => {
    if (loading || isFetching.current) return; // Prevent multiple calls
    setLoading(true);
    isFetching.current = true; // Set fetching state

    try {
      const addresses = await getLotteryContractAddresses(LOAD_STEP);

      if (addresses.length > 0) {
        const newLotteries = [] as any;

        for (const address of addresses) {
          const lottery = await getLotteryInfo(address);
          if (lottery.nft_address) {
            const nft_info = await getNftPreview(lottery.nft_address);
            lottery.nft_preview = nft_info.url;
            lottery.nft_name = nft_info.name;
          }
          newLotteries.push(lottery);
        }

        setLotteries(prev => [...prev, ...newLotteries]);
        setLoadedCount(prev => prev + newLotteries.length);

        // if (newLotteries.length < 3) {
        //   const localLotteries = await getLocalLotteryInfo();
        //   setLotteries(prev => [...prev, ...localLotteries]);
        //   setLoadedCount(prev => prev + localLotteries.length);
        // }
      } else if (!isLocalLoaded) {
        setLocalLoaded(true);
        const localLotteries = await getLocalLotteryInfo();
        setLotteries(prev => [...prev, ...localLotteries]);
        setLoadedCount(prev => prev + localLotteries.length);
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
    if (lotteries.length === 0) {
      loadMoreLotteries();
    }
  }, []); // Only run on mount

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full">
      <div className="jackpot-grid mt-8">
        {lotteries.map((lottery, index) => (
          <LotteryCard key={index} lottery={lottery} />
        ))}
      </div>
      { !isLocalLoaded && <button
        onClick={loadMoreLotteries}
        disabled={loading}
        className="mt-4 bg-emerald-400 w-full text-white px-4 py-2 rounded"
      >
        {loading ? 'Loading...' : 'Load more'}
      </button>}
    </div>
  );
};

export default LotteryGrid;

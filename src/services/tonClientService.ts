// src/services/tonClientService.ts

import { TonClient, Address } from 'ton';
import { LOTTERY_MASTER_CA, CREATE_LOTTERY_OP, TON_API_URL_ACCOUNTS, TON_API_URL_NFTS, TON_CLIENT_URL } from '@/const';
import axios from 'axios';
import localLotteries from '../data/localLotteries.json'; // Import the local JSON file

const client = new TonClient({
    endpoint: TON_CLIENT_URL
});

let lastTransactionLT: number | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (fetchFunction: () => Promise<any>, retries: number = 5, delayTime: number = 2000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await fetchFunction();
        } catch (error: any) {
            if (attempt < retries - 1 && error.response && error.response.status === 429) {
                console.warn(`Rate limit exceeded. Retrying in ${delayTime}ms...`);
                await delay(delayTime);
                delayTime *= 2;
            } else {
                throw error;
            }
        }
    }
};

export const getLotteryContractAddresses = async (limit: number = 10) => {
    const url = new URL(`${TON_API_URL_ACCOUNTS}/${encodeURIComponent(LOTTERY_MASTER_CA)}/transactions`);
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('sort_order', 'desc');
    if (lastTransactionLT) {
        url.searchParams.append('before_lt', lastTransactionLT.toString());
    }

    const response = await fetchWithRetry(async () => {
        return axios.get(url.toString());
    });

    const transactions = response.data.transactions;

    const addresses = transactions
        .filter((tx: any) => tx.out_msgs.some((outMsg: any) => +outMsg.op_code === CREATE_LOTTERY_OP))
        .map((tx: any) => {
            const outMsg = tx.out_msgs.find((outMsg: any) => +outMsg.op_code === CREATE_LOTTERY_OP);
            return outMsg.destination.address;
        });

    if (transactions.length > 0) {
        lastTransactionLT = transactions[transactions.length - 1].lt;
    }

    return addresses;
};

export const getNftPreview = async (address: string) => {
    const url = new URL(`${TON_API_URL_NFTS}/${encodeURIComponent(address)}`);
    
    const response = await fetchWithRetry(async () => {
        return axios.get(url.toString());
    });
    return { url: response.data.previews[response.data.previews.length - 1].url, name: response.data.metadata.name};
};

export const getLotteryInfo = async (address: string) => {
    const result = await fetchWithRetry(async () => {
        return client.runMethod(
            Address.parse(address),
            'get_info'
        );
    });

    const lottery = {
        address: Address.parse(address).toString(),
        id: result.stack.readBigNumber().toString(),
        isFinished: result.stack.readBoolean(),
        isRefunded: result.stack.readBoolean(),
        creator: result.stack.readAddressOpt()?.toString(),
        winner: result.stack.readAddressOpt()?.toString(),
        goalPrice: result.stack.readBigNumber().toString(),
        totalBets: result.stack.readBigNumber().toString(),
        minBet: result.stack.readBigNumber().toString(),
        nft_address: result.stack.readAddressOpt()?.toString(),
        duration: result.stack.readBigNumber().toString(),
        deadline: result.stack.readBigNumber().toString(),
        nft_preview: '',
        nft_name: '',
    };

    return lottery;
};

export const getLocalLotteryInfo = async () => {
    return localLotteries;
};

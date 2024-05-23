const mainnet = false;

const JACKPOT_MASTER_CA = mainnet
    ? '0:7ede2525c0590719a1b8f13b43733ad66bafe971610b989681e16f6c570c16e3'
    : '0:016d4a2a542b41fe92e353d34ac2f57592f284a5301306b379a7783fecc72240';

const TON_API_URL_ACCOUNTS = mainnet
    ? 'https://tonapi.io/v2/blockchain/accounts'
    : 'https://testnet.tonapi.io/v2/blockchain/accounts';
const TON_API_URL_NFTS = mainnet
    ? 'https://tonapi.io/v2/nfts'
    : 'https://testnet.tonapi.io/v2/nfts';

const TON_CLIENT_URL = mainnet
    ? 'https://toncenter.com/api/v2/jsonRPC'
    : 'https://testnet.toncenter.com/api/v2/jsonRPC';

export { JACKPOT_MASTER_CA, TON_API_URL_ACCOUNTS, TON_CLIENT_URL, TON_API_URL_NFTS };
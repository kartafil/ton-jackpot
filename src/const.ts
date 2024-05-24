const mainnet = false;

const CREATE_LOTTERY_OP = 0x9ddf4d89;

const LOTTERY_MASTER_CA = mainnet
    ? '0:7ede2525c0590719a1b8f13b43733ad66bafe971610b989681e16f6c570c16e3'
    : '0:867d2f27def6bdfe25793b6887a0f2b8f79d8d739c5be145c4be13cae2b7d458';

const TON_API_URL_ACCOUNTS = mainnet
    ? 'https://tonapi.io/v2/blockchain/accounts'
    : 'https://testnet.tonapi.io/v2/blockchain/accounts';
const TON_API_URL_NFTS = mainnet
    ? 'https://tonapi.io/v2/nfts'
    : 'https://testnet.tonapi.io/v2/nfts';

const TON_CLIENT_URL = mainnet
    ? 'https://toncenter.com/api/v2/jsonRPC'
    : 'https://testnet.toncenter.com/api/v2/jsonRPC';

export { LOTTERY_MASTER_CA, CREATE_LOTTERY_OP, TON_API_URL_ACCOUNTS, TON_CLIENT_URL, TON_API_URL_NFTS };
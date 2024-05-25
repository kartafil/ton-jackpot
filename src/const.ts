const mainnet = true;

const CREATE_LOTTERY_OP = 0x9ddf4d89;

const LOTTERY_MASTER_CA = mainnet
    ? '0:bb46e25d15ead0a76cfca6a7426a6ea3090462015dd620c9c152a03ca6f28191'
    : '0:bb46e25d15ead0a76cfca6a7426a6ea3090462015dd620c9c152a03ca6f28191';

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
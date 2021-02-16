import { DEFAULT_RPC_BIND, DEFAULT_RPC_PORT } from '@defi_types/settings';
import packageInfo from '../../package.json';

export const PAYMENT_REQUEST = 'paymentRequests';
export const UNIT = 'unit';
export const BLOCK_STORAGE = 'blockStorage';
export const DATABASE_CACHE = 'databaseCache';
export const MAXIMUM_AMOUNT = 'maximumAmount';
export const MAXIMUM_COUNT = 'maximumCount';
export const FEE_RATE = 'feeRate';
export const DISPLAY_MODE = 'displayMode';
export const LANG_VARIABLE = 'lang';
export const LAUNCH_AT_LOGIN = 'launchAtLogin';
export const LAUNCH_MINIMIZED = 'minimizedAtLaunch';
export const PRUNE_BLOCK_STORAGE = 'pruneBlockStorage';
export const ENGLISH = 'en';
export const ENGLISH_BRITISH = 'en-GB';
export const SCRIPT_VERIFICATION = 'scriptVerification';
export const GERMAN = 'de';
export const FRENCH = 'fr';
export const CHINESE_SIMPLIFIED = 'zhs';
export const CHINESE_TRADITIONAL = 'zht';
export const DUTCH = 'nl';
export const RUSSIAN = 'ru';
export const LIGHT_DISPLAY = 'LIGHT';
export const DARK_DISPLAY = 'DARK';
export const SAME_AS_SYSTEM_DISPLAY = 'SAME_AS_SYSTEM';
export const CONSOLE_PROMPT_LABEL = `${packageInfo.name}_v${packageInfo.version}`;
export const PACKAGE_VERSION = packageInfo.version;
export const PACKAGE_NAME = packageInfo.name;
export const APP_TITLE = 'DeFi app';
export const MAINNET = 'Mainnet';
export const TESTNET = 'Testnet';
export const REGTEST = 'regtest';
export const DEFAULT_MAINNET_CONNECT = DEFAULT_RPC_BIND;
export const DEFAULT_TESTNET_CONNECT = DEFAULT_RPC_BIND;
export const DEFAULT_REGTEST_CONNECT = DEFAULT_RPC_BIND;
export const DEFAULT_MAINNET_PORT = DEFAULT_RPC_PORT;
export const DEFAULT_TESTNET_PORT = DEFAULT_RPC_PORT;
export const DEFAULT_REGTEST_PORT = DEFAULT_RPC_PORT;
export const BLOCKCHAIN_INFO_CHAIN_MAINNET = 'main';
export const BLOCKCHAIN_INFO_CHAIN_TEST = 'test';
export const DEFAULT_MAIN = 'defaultMainAddress';
export const DEFAULT_TEST = 'defaultTestAddress';

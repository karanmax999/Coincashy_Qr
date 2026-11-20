export type LiquidityClass = 'Major' | 'Liquid' | 'Emerging' | 'Restricted';

export type FlowType = 'fiat_to_crypto' | 'crypto_to_fiat' | 'fiat_to_fiat';

export type VolumeTierIndex = 0 | 1 | 2 | 3 | 4;

export interface VolumeTierDef {
  index: VolumeTierIndex;
  label: string;
  minUsd: number;
  maxUsd: number;
}

export interface CountryConfig {
  country: string;
  code: string;
  class: LiquidityClass;
  perUsd: number | null;
  perEur: number | null;
  fiatToCryptoTiers: [number, number, number, number, number];
  cryptoToFiatTiers: [number, number, number, number, number];
  fiatToFiatTiers: [number, number, number, number, number];
  rail: string;
  settlementTime: string;
  notes: string;
  flag?: string;
  defaultLpRate?: number;
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  usdRate: number;
  decimals: number;
}

export interface PricingQuote {
  flow: FlowType;
  sourceAmount: number;
  sourceCurrency: string;
  targetCurrency: string;
  sourceCountry?: CountryConfig;
  targetCountry?: CountryConfig;
  sourceRateUsd: number;
  targetRateUsd: number;
  notionalUsd: number;
  tierIndex: VolumeTierIndex;
  tierLabel: string;
  baseFeePercent: number;
  basisPointsAdj: number;
  effectiveFeePercent: number;
  midExchangeRate: number;
  effectiveExchangeRate: number;
  grossTargetAmount: number;
  feeAmountTarget: number;
  feeAmountUsd: number;
  netTargetAmount: number;
  rail: string;
  settlementTime: string;
  notes: string;
  governingClass: LiquidityClass;
  nextTier?: {
    label: string;
    thresholdUsd: number;
    amountNeededUsd: number;
    potentialFeePercent: number;
  };
}

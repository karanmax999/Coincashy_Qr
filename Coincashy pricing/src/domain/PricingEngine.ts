import { CountryConfig, CryptoAsset, FlowType, PricingQuote } from './types';
import { TierResolver } from './TierResolver';
import { ClassRanker } from './ClassRanker';

export interface CalculationParams {
  flow: FlowType;
  sourceAmount: number;
  sourceCode: string;
  targetCode: string;
  countries: CountryConfig[];
  cryptoAssets: CryptoAsset[];
  customRates: Record<string, number>;
  basisPointsAdj: number;
}

export class PricingEngine {
  public static calculateQuote(params: CalculationParams): PricingQuote {
    const { flow, sourceAmount, sourceCode, targetCode, countries, cryptoAssets, customRates, basisPointsAdj } = params;

    const sourceCountry = countries.find(c => c.code === sourceCode);
    const targetCountry = countries.find(c => c.code === targetCode);
    const sourceCrypto = cryptoAssets.find(c => c.symbol === sourceCode);
    const targetCrypto = cryptoAssets.find(c => c.symbol === targetCode);

    // Resolve USD rates
    const sourceRate = this.resolveUnitRateUsd(sourceCode, sourceCountry, sourceCrypto, customRates);
    const targetRate = this.resolveUnitRateUsd(targetCode, targetCountry, targetCrypto, customRates);

    const notionalUsd = this.calculateNotionalUsd(sourceAmount, sourceRate, sourceCrypto);
    const tier = TierResolver.resolveTier(notionalUsd);

    const { baseFee, governingClass, rail, settlementTime, notes, tierSourceArray } = this.resolveFeeAndMetadata(
      flow,
      sourceCountry,
      targetCountry,
      tier.index
    );

    const effectiveFeePercent = Math.max(0, baseFee + basisPointsAdj / 100);
    const midExchangeRate = this.calculateMidRate(sourceRate, targetRate, sourceCrypto, targetCrypto);

    const grossTargetAmount = sourceAmount * midExchangeRate;
    const feeAmountTarget = grossTargetAmount * (effectiveFeePercent / 100);
    const netTargetAmount = Math.max(0, grossTargetAmount - feeAmountTarget);
    const effectiveExchangeRate = sourceAmount > 0 ? netTargetAmount / sourceAmount : 0;
    const feeAmountUsd = notionalUsd * (effectiveFeePercent / 100);

    const nextTier = TierResolver.getNextTierInfo(notionalUsd, tier.index, tierSourceArray);

    return {
      flow,
      sourceAmount,
      sourceCurrency: sourceCode,
      targetCurrency: targetCode,
      sourceCountry,
      targetCountry,
      sourceRateUsd: sourceRate,
      targetRateUsd: targetRate,
      notionalUsd,
      tierIndex: tier.index,
      tierLabel: tier.label,
      baseFeePercent: baseFee,
      basisPointsAdj,
      effectiveFeePercent,
      midExchangeRate,
      effectiveExchangeRate,
      grossTargetAmount,
      feeAmountTarget,
      feeAmountUsd,
      netTargetAmount,
      rail,
      settlementTime,
      notes,
      governingClass,
      nextTier
    };
  }

  private static resolveUnitRateUsd(
    code: string,
    country?: CountryConfig,
    crypto?: CryptoAsset,
    customRates: Record<string, number> = {}
  ): number {
    if (customRates[code] && customRates[code] > 0) return customRates[code];
    if (crypto) return crypto.usdRate;
    if (country) return country.perUsd ?? country.defaultLpRate ?? 1.0;
    return 1.0;
  }

  private static calculateNotionalUsd(
    amount: number,
    sourceRate: number,
    sourceCrypto?: CryptoAsset
  ): number {
    if (amount <= 0) return 0;
    if (sourceCrypto) return amount * sourceRate;
    // Fiat: sourceRate is units per 1 USD
    return sourceRate > 0 ? amount / sourceRate : amount;
  }

  private static calculateMidRate(
    sourceRate: number,
    targetRate: number,
    sourceCrypto?: CryptoAsset,
    targetCrypto?: CryptoAsset
  ): number {
    if (sourceCrypto && targetCrypto) {
      return targetRate > 0 ? sourceRate / targetRate : 1.0;
    }
    if (sourceCrypto && !targetCrypto) {
      // e.g. 1 BTC ($84297) -> EUR (0.8969 per USD) => 1 BTC = 84297 * 0.8969 EUR
      return sourceRate * targetRate;
    }
    if (!sourceCrypto && targetCrypto) {
      // e.g. PLN (3.948 per USD) -> USDT ($1.0) => 1 PLN = (1 / 3.948) / 1.0 USDT
      const fiatInUsd = sourceRate > 0 ? 1 / sourceRate : 1.0;
      return targetRate > 0 ? fiatInUsd / targetRate : fiatInUsd;
    }
    // Fiat to Fiat: sourceRate is units/USD, targetRate is units/USD
    // 1 unit of Source = (1 / sourceRate) USD = (1 / sourceRate) * targetRate units of Target
    return sourceRate > 0 ? targetRate / sourceRate : 1.0;
  }

  private static resolveFeeAndMetadata(
    flow: FlowType,
    sourceCountry?: CountryConfig,
    targetCountry?: CountryConfig,
    tierIndex: number = 0
  ) {
    if (flow === 'fiat_to_crypto' && sourceCountry) {
      return {
        baseFee: sourceCountry.fiatToCryptoTiers[tierIndex],
        governingClass: sourceCountry.class,
        rail: sourceCountry.rail,
        settlementTime: sourceCountry.settlementTime,
        notes: sourceCountry.notes,
        tierSourceArray: sourceCountry.fiatToCryptoTiers
      };
    }

    if (flow === 'crypto_to_fiat' && targetCountry) {
      return {
        baseFee: targetCountry.cryptoToFiatTiers[tierIndex],
        governingClass: targetCountry.class,
        rail: targetCountry.rail,
        settlementTime: targetCountry.settlementTime,
        notes: targetCountry.notes,
        tierSourceArray: targetCountry.cryptoToFiatTiers
      };
    }

    // Fiat to Fiat
    const cA = sourceCountry || targetCountry;
    const cB = targetCountry || sourceCountry;
    if (!cA || !cB) {
      return {
        baseFee: 0.25,
        governingClass: 'Major' as const,
        rail: 'Bank Transfer',
        settlementTime: 'Same day',
        notes: '',
        tierSourceArray: [0.35, 0.25, 0.18, 0.12, 0.08] as [number, number, number, number, number]
      };
    }

    const harderClass = ClassRanker.getHarderClass(cA.class, cB.class);
    const feeA = cA.fiatToFiatTiers[tierIndex];
    const feeB = cB.fiatToFiatTiers[tierIndex];
    const baseFee = Math.max(feeA, feeB);
    const governingCountry = feeA >= feeB ? cA : cB;

    return {
      baseFee,
      governingClass: harderClass,
      rail: `${cA.code}: ${cA.rail} → ${cB.code}: ${cB.rail}`,
      settlementTime: cB.settlementTime || cA.settlementTime,
      notes: [cA.notes, cB.notes].filter(Boolean).join(' | '),
      tierSourceArray: governingCountry.fiatToFiatTiers
    };
  }
}

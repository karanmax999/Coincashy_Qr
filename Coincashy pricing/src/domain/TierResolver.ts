import { VOLUME_TIERS } from '../data/countryData';
import { VolumeTierDef, VolumeTierIndex } from './types';

export class TierResolver {
  public static resolveTier(notionalUsd: number): VolumeTierDef {
    if (notionalUsd >= 10_000_000) return VOLUME_TIERS[4];
    if (notionalUsd >= 1_000_000) return VOLUME_TIERS[3];
    if (notionalUsd >= 500_000) return VOLUME_TIERS[2];
    if (notionalUsd >= 100_000) return VOLUME_TIERS[1];
    return VOLUME_TIERS[0];
  }

  public static getNextTierInfo(
    notionalUsd: number,
    currentTierIndex: VolumeTierIndex,
    tiers: [number, number, number, number, number]
  ) {
    if (currentTierIndex >= 4) return undefined;

    const nextTierIndex = (currentTierIndex + 1) as VolumeTierIndex;
    const nextTier = VOLUME_TIERS[nextTierIndex];
    const amountNeededUsd = Math.max(0, nextTier.minUsd - notionalUsd);

    return {
      label: nextTier.label,
      thresholdUsd: nextTier.minUsd,
      amountNeededUsd,
      potentialFeePercent: tiers[nextTierIndex]
    };
  }
}

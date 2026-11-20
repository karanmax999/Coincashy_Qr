import { LiquidityClass } from './types';

export class ClassRanker {
  private static readonly RANK_MAP: Record<LiquidityClass, number> = {
    Major: 1,
    Liquid: 2,
    Emerging: 3,
    Restricted: 4
  };

  public static getHarderClass(a: LiquidityClass, b: LiquidityClass): LiquidityClass {
    const rankA = this.RANK_MAP[a] || 1;
    const rankB = this.RANK_MAP[b] || 1;
    return rankA >= rankB ? a : b;
  }
}

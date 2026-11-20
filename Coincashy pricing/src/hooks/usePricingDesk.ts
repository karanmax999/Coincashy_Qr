import { useState, useMemo, useCallback } from 'react';
import { COUNTRIES, CRYPTO_ASSETS } from '../data/countryData';
import { PricingEngine } from '../domain/PricingEngine';
import { FlowType, PricingQuote } from '../domain/types';

export function usePricingDesk() {
  const [flow, setFlow] = useState<FlowType>('fiat_to_crypto');
  const [sourceCode, setSourceCode] = useState<string>('PLN');
  const [targetCode, setTargetCode] = useState<string>('USDT');
  const [sourceAmount, setSourceAmount] = useState<number>(250000);
  const [customRates, setCustomRates] = useState<Record<string, number>>({});
  const [basisPointsAdj, setBasisPointsAdj] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'calculator' | 'matrix'>('calculator');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Switch flow and set appropriate default pairs
  const handleFlowChange = useCallback((newFlow: FlowType) => {
    setFlow(newFlow);
    if (newFlow === 'fiat_to_crypto') {
      setSourceCode('PLN');
      setTargetCode('USDT');
    } else if (newFlow === 'crypto_to_fiat') {
      setSourceCode('USDT');
      setTargetCode('EUR');
    } else {
      setSourceCode('EUR');
      setTargetCode('PLN');
    }
  }, []);

  const handleCustomRateChange = useCallback((code: string, rate: number) => {
    setCustomRates(prev => ({ ...prev, [code]: rate }));
  }, []);

  const quote: PricingQuote = useMemo(() => {
    return PricingEngine.calculateQuote({
      flow,
      sourceAmount,
      sourceCode,
      targetCode,
      countries: COUNTRIES,
      cryptoAssets: CRYPTO_ASSETS,
      customRates,
      basisPointsAdj
    });
  }, [flow, sourceAmount, sourceCode, targetCode, customRates, basisPointsAdj]);

  const copyQuoteToClipboard = useCallback(() => {
    const lines = [
      `🏛️ COINCASHY OTC QUOTE`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Pair: ${quote.sourceCurrency} → ${quote.targetCurrency}`,
      `You Send: ${quote.sourceAmount.toLocaleString()} ${quote.sourceCurrency}`,
      `You Receive: ${quote.netTargetAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${quote.targetCurrency}`,
      `Effective Rate: 1 ${quote.sourceCurrency} = ${quote.effectiveExchangeRate.toFixed(6)} ${quote.targetCurrency}`,
      `All-In Fee: ${quote.effectiveFeePercent.toFixed(2)}% (Tier: ${quote.tierLabel})`,
      `Settlement Rail: ${quote.rail}`,
      `Delivery Time: ${quote.settlementTime}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Valid for immediate execution. Coincashy Institutional Desk.`
    ];
    const text = lines.join('\n');
    navigator.clipboard.writeText(text);
    setCopyFeedback('Quote copied to clipboard!');
    setTimeout(() => setCopyFeedback(null), 3000);
  }, [quote]);

  return {
    flow,
    sourceCode,
    targetCode,
    sourceAmount,
    customRates,
    basisPointsAdj,
    activeTab,
    isQuoteModalOpen,
    copyFeedback,
    quote,
    countries: COUNTRIES,
    cryptoAssets: CRYPTO_ASSETS,
    setFlow: handleFlowChange,
    setSourceCode,
    setTargetCode,
    setSourceAmount,
    setCustomRate: handleCustomRateChange,
    setBasisPointsAdj,
    setActiveTab,
    setIsQuoteModalOpen,
    copyQuoteToClipboard
  };
}

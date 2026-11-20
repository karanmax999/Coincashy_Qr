import React from 'react';
import { usePricingDesk } from '../hooks/usePricingDesk';
import { Header } from './Header';
import { FlowSelector } from './FlowSelector';
import { CurrencyPair } from './CurrencyPair';
import { AmountInput } from './AmountInput';
import { TierProgress } from './TierProgress';
import { QuoteDisplay } from './QuoteDisplay';
import { SettlementCard } from './SettlementCard';
import { DeskControls } from './DeskControls';
import { ClientQuoteModal } from './ClientQuoteModal';
import { MatrixTable } from './MatrixTable';

export const App: React.FC = () => {
  const desk = usePricingDesk();

  return (
    <div className="desk-container">
      <Header
        activeTab={desk.activeTab}
        onTabChange={desk.setActiveTab}
      />

      {desk.activeTab === 'calculator' ? (
        <main>
          <FlowSelector
            flow={desk.flow}
            onSelect={desk.setFlow}
          />

          <CurrencyPair
            flow={desk.flow}
            sourceCode={desk.sourceCode}
            targetCode={desk.targetCode}
            countries={desk.countries}
            cryptoAssets={desk.cryptoAssets}
            onSourceChange={desk.setSourceCode}
            onTargetChange={desk.setTargetCode}
          />

          <AmountInput
            amount={desk.sourceAmount}
            sourceCurrency={desk.sourceCode}
            notionalUsd={desk.quote.notionalUsd}
            onChange={desk.setSourceAmount}
          />

          <TierProgress quote={desk.quote} />

          <QuoteDisplay
            quote={desk.quote}
            copyFeedback={desk.copyFeedback}
            onCopyQuote={desk.copyQuoteToClipboard}
            onOpenModal={() => desk.setIsQuoteModalOpen(true)}
          />

          <SettlementCard quote={desk.quote} />

          <DeskControls
            quote={desk.quote}
            basisPointsAdj={desk.basisPointsAdj}
            onBasisPointsChange={desk.setBasisPointsAdj}
            onCustomRateChange={desk.setCustomRate}
          />
        </main>
      ) : (
        <MatrixTable
          countries={desk.countries}
          onSelectCountry={(code) => {
            desk.setSourceCode(code);
            desk.setActiveTab('calculator');
          }}
        />
      )}

      <ClientQuoteModal
        isOpen={desk.isQuoteModalOpen}
        quote={desk.quote}
        copyFeedback={desk.copyFeedback}
        onClose={() => desk.setIsQuoteModalOpen(false)}
        onCopy={desk.copyQuoteToClipboard}
      />
    </div>
  );
};

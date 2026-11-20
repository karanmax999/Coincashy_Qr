import React from 'react';

export interface CryptoLogoProps {
  symbol: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function CryptoLogo({ symbol, size = 32, className, style }: CryptoLogoProps) {
  // Normalize symbol: extract first alphabetic token e.g. "EUR (SEPA Instant)" -> "EUR"
  const raw = symbol || '';
  const match = raw.match(/[A-Za-z]+/);
  const sym = match ? match[0].toUpperCase() : raw.toUpperCase();

  switch (sym) {
    case 'BTC':
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          className={className}
          style={{ flexShrink: 0, borderRadius: '50%', ...style }}
          aria-label="Bitcoin logo"
        >
          <circle cx="16" cy="16" r="16" fill="#F7931A" />
          <path
            d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.113-.92-.22-1.383-.326l.695-2.783-1.728-.431-.709 2.839c-.376-.086-.745-.17-1.104-.26l.002-.007-2.385-.595-.46 1.846s1.283.294 1.256.312c.7.175.827.64.806 1.008l-.808 3.24c.048.012.11.03.18.057-.058-.014-.12-.03-.182-.045l-1.132 4.54c-.086.213-.304.533-.795.411.017.025-1.258-.314-1.258-.314l-.859 1.982 2.25.561c.419.105.83.213 1.236.317l-.717 2.876 1.727.43.71-2.845c.472.128.93.246 1.378.358l-.707 2.835 1.728.431.718-2.877c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.384-1.587-4.192 1.13-.26 1.98-.999 2.207-2.528zm-3.95 5.516c-.534 2.146-4.15.986-5.32.695l.95-3.805c1.17.292 4.92.87 4.37 3.11zm.54-5.548c-.488 1.954-3.498.961-4.475.718l.86-3.45c.977.243 4.116.697 3.615 2.732z"
            fill="#FFF"
          />
        </svg>
      );

    case 'ETH':
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          className={className}
          style={{ flexShrink: 0, borderRadius: '50%', ...style }}
          aria-label="Ethereum logo"
        >
          <circle cx="16" cy="16" r="16" fill="#627EEA" />
          <g fill="#FFF">
            <path d="M16.498 4v8.87l7.497 3.35L16.498 4z" fillOpacity=".6" />
            <path d="M16.498 4L9 16.22l7.498-3.35V4z" />
            <path d="M16.498 21.968v6.027L24 17.616l-7.502 4.352z" fillOpacity=".6" />
            <path d="M16.498 27.995v-6.028L9 17.616l7.498 10.38z" />
            <path d="M16.498 20.573l7.497-4.353-7.497-3.348v7.701z" fillOpacity=".2" />
            <path d="M9 16.22l7.498 4.353v-7.701L9 16.22z" fillOpacity=".6" />
          </g>
        </svg>
      );

    case 'USDT':
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          className={className}
          style={{ flexShrink: 0, borderRadius: '50%', ...style }}
          aria-label="Tether logo"
        >
          <circle cx="16" cy="16" r="16" fill="#26A17B" />
          <path
            d="M17.922 17.138c-.134.01-.703.042-1.895.042-1.026 0-1.684-.032-1.873-.042-3.64-.16-6.36-1.018-6.36-2.054 0-1.037 2.72-1.895 6.36-2.055V10.6h-5.08V7h13.91v3.6h-5.062v2.429c3.636.16 6.353 1.018 6.353 2.055 0 1.036-2.717 1.894-6.353 2.054v7.45h-3.876v-7.45h.001c.057 0 .114 0 .17-.001.077 0 .153.001.23.001h-.033c.47 0 .963-.01 1.489-.033.483-.021.966-.053 1.45-.095z"
            fill="#FFF"
          />
        </svg>
      );

    case 'USDC':
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          className={className}
          style={{ flexShrink: 0, borderRadius: '50%', ...style }}
          aria-label="USD Coin logo"
        >
          <circle cx="16" cy="16" r="16" fill="#2775CA" />
          <path
            d="M19.7 18.2c-.3 1.7-1.7 2.8-3.7 2.9v1.9h-1.6v-1.9c-1.4-.1-2.5-.6-3.2-1.5l1.5-1.5c.5.6 1.1.9 1.7 1v-3.2c-1.9-.5-3.3-1.4-3.3-3.2 0-1.7 1.3-2.8 3.3-2.9V7.9h1.6v1.9c1.2.1 2.1.5 2.7 1.1l-1.4 1.5c-.4-.4-.8-.7-1.3-.8v3c2 .6 3.7 1.4 3.7 3.6zm-5.3-4.2c0 .6.4 1 .9 1.1v-2.3c-.5.1-.9.5-.9 1.2zm2.1 4.7c.6-.1 1-.5 1-1.2 0-.6-.4-1-1-1.2v2.4z"
            fill="#FFF"
          />
          <circle cx="16" cy="16" r="12" stroke="#FFF" strokeOpacity=".3" strokeWidth="1.2" />
        </svg>
      );

    case 'EUR':
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          className={className}
          style={{ flexShrink: 0, borderRadius: '50%', ...style }}
          aria-label="Euro logo"
        >
          <circle cx="16" cy="16" r="16" fill="#003399" />
          <path
            d="M21.5 10.8c-.8-1.5-2.2-2.5-3.8-2.8-2.6-.5-5.3.4-6.8 2.6H8.5v2h2.2c-.1.5-.1 1-.1 1.4s0 .9.1 1.4H8.5v2h2.9c1.5 2.2 4.2 3.1 6.8 2.6 1.6-.3 3-1.3 3.8-2.8l-1.8-1c-.5 1-1.4 1.7-2.5 1.9-1.9.4-3.7-.3-4.8-2h6.1v-2h-6.7c0-.5-.1-.9-.1-1.4 0-.5.1-.9.1-1.4h6.7v-2h-6.1c1.1-1.7 2.9-2.4 4.8-2 1.1.2 2 .9 2.5 1.9l1.8-1z"
            fill="#FFF"
          />
        </svg>
      );

    case 'USD':
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          className={className}
          style={{ flexShrink: 0, borderRadius: '50%', ...style }}
          aria-label="US Dollar logo"
        >
          <circle cx="16" cy="16" r="16" fill="#F59E0B" />
          <path
            d="M17.2 13.8v-2h-2.4v2c-1.8.2-3.1 1.3-3.1 2.9 0 1.9 1.5 2.6 3.5 2.9v2.8c-1-.2-1.6-.7-1.9-1.5H11c.2 1.6 1.4 2.7 3.1 3v2h2.4v-2c2-.2 3.3-1.4 3.3-3.1 0-1.8-1.4-2.6-3.5-2.9v-2.7c.9.2 1.4.6 1.6 1.3h2.2c-.2-1.4-1.3-2.4-2.9-2.7zm-2.4 3.9c-.7-.1-1.2-.4-1.2-1.1 0-.6.5-1.1 1.2-1.2v2.3zm2.4 3.3c.7.1 1.2.4 1.2 1.1 0 .8-.5 1.2-1.2 1.3v-2.4z"
            fill="#FFF"
          />
        </svg>
      );

    case 'SOL':
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          className={className}
          style={{ flexShrink: 0, borderRadius: '50%', ...style }}
          aria-label="Solana logo"
        >
          <circle cx="16" cy="16" r="16" fill="#0E0F14" />
          <defs>
            <linearGradient id="sol-grad-1" x1="24" y1="8" x2="8" y2="11" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FFA3" />
              <stop offset="1" stopColor="#DC1FFF" />
            </linearGradient>
            <linearGradient id="sol-grad-2" x1="24" y1="14" x2="8" y2="17" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FFA3" />
              <stop offset="1" stopColor="#DC1FFF" />
            </linearGradient>
            <linearGradient id="sol-grad-3" x1="24" y1="20" x2="8" y2="23" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FFA3" />
              <stop offset="1" stopColor="#DC1FFF" />
            </linearGradient>
          </defs>
          <path
            d="M10.8 7.5h12.4c.3 0 .5.2.4.5l-2.4 2.8c-.1.1-.3.2-.5.2H8.3c-.3 0-.5-.2-.4-.5l2.4-2.8c.1-.1.3-.2.5-.2z"
            fill="url(#sol-grad-1)"
          />
          <path
            d="M8.3 14.1h12.4c.2 0 .4.1.5.2l2.4 2.8c.1.3 0 .5-.4.5H10.8c-.2 0-.4-.1-.5-.2l-2.4-2.8c-.1-.3 0-.5.4-.5z"
            fill="url(#sol-grad-2)"
          />
          <path
            d="M10.8 20.7h12.4c.3 0 .5.2.4.5l-2.4 2.8c-.1.1-.3.2-.5.2H8.3c-.3 0-.5-.2-.4-.5l2.4-2.8c.1-.1.3-.2.5-.2z"
            fill="url(#sol-grad-3)"
          />
        </svg>
      );

    case 'BNB':
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          className={className}
          style={{ flexShrink: 0, borderRadius: '50%', ...style }}
          aria-label="BNB logo"
        >
          <circle cx="16" cy="16" r="16" fill="#F0B90B" />
          <path
            d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6 9.856 12.144l2.26 2.26zm-6.116 1.6l2.26-2.26 2.26 2.26-2.26 2.26-2.26-2.26zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.26L16 26l-6.144-6.144 2.26-2.26zm9.998-1.596l2.26-2.26 2.26 2.26-2.26 2.26-2.26-2.26zm-6.114-1.6l2.26 2.26-2.26 2.26-2.26-2.26 2.26-2.26z"
            fill="#FFF"
          />
        </svg>
      );

    case 'TRX':
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          className={className}
          style={{ flexShrink: 0, borderRadius: '50%', ...style }}
          aria-label="Tron logo"
        >
          <circle cx="16" cy="16" r="16" fill="#EF0027" />
          <path
            d="M24.78 8.87L7.22 6.83 14.33 26l10.45-17.13zm-1.89 1.48l-7.79 12.78-4.9-13.2 12.69.42zm-8.81 13.93l6.59-10.81 2.37.08-8.96 10.73z"
            fill="#FFF"
          />
        </svg>
      );

    case 'AED':
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          className={className}
          style={{ flexShrink: 0, borderRadius: '50%', ...style }}
          aria-label="United Arab Emirates Dirham logo"
        >
          <circle cx="16" cy="16" r="16" fill="#00732F" />
          <circle cx="16" cy="16" r="14.5" stroke="#FFF" strokeOpacity="0.25" strokeWidth="1" />
          <text
            x="16"
            y="20"
            fill="#FFF"
            fontSize="9"
            fontWeight="800"
            textAnchor="middle"
            fontFamily="var(--f-display), system-ui, sans-serif"
            letterSpacing="0.04em"
          >
            AED
          </text>
        </svg>
      );

    case 'PLN':
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          className={className}
          style={{ flexShrink: 0, borderRadius: '50%', ...style }}
          aria-label="Polish Zloty logo"
        >
          <circle cx="16" cy="16" r="16" fill="#DC2626" />
          <text x="16" y="21" fill="#FFF" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
            zł
          </text>
        </svg>
      );

    default:
      return (
        <span
          className="coin sm"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            fontSize: `${Math.max(10, size * 0.42)}px`,
            display: 'inline-grid',
            placeItems: 'center',
            borderRadius: '50%',
            background: 'var(--surface-2)',
            border: '1px solid var(--line)',
            color: 'var(--fg)',
            fontWeight: 700,
            fontFamily: 'var(--f-display), sans-serif',
            flexShrink: 0,
            ...style,
          }}
        >
          {sym.slice(0, 3)}
        </span>
      );
  }
}

export default CryptoLogo;
export { CryptoLogo as AssetLogo };

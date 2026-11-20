import { CountryConfig, CryptoAsset, VolumeTierDef } from '../domain/types';

export const VOLUME_TIERS: VolumeTierDef[] = [
  { index: 0, label: '<$100K', minUsd: 0, maxUsd: 100_000 },
  { index: 1, label: '$100K–500K', minUsd: 100_000, maxUsd: 500_000 },
  { index: 2, label: '$500K–1M', minUsd: 500_000, maxUsd: 1_000_000 },
  { index: 3, label: '$1M–10M', minUsd: 1_000_000, maxUsd: 10_000_000 },
  { index: 4, label: '>$10M', minUsd: 10_000_000, maxUsd: Infinity }
];

export const CRYPTO_ASSETS: CryptoAsset[] = [
  { symbol: 'USDT', name: 'Tether USD', usdRate: 1.0, decimals: 2 },
  { symbol: 'USDC', name: 'USD Coin', usdRate: 1.0, decimals: 2 },
  { symbol: 'BTC', name: 'Bitcoin', usdRate: 84297.67, decimals: 6 },
  { symbol: 'ETH', name: 'Ethereum', usdRate: 2640.35, decimals: 5 },
  { symbol: 'SOL', name: 'Solana', usdRate: 154.20, decimals: 4 }
];

export const COUNTRIES: CountryConfig[] = [
  {
    "country": "Poland",
    "code": "PLN",
    "class": "Liquid",
    "perUsd": 3.948,
    "perEur": 4.402,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "Elixir / Express Elixir",
    "settlementTime": "Same day; instant 24/7",
    "notes": "Home market",
    "flag": "🇵🇱",
    "defaultLpRate": 3.948
  },
  {
    "country": "Germany",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "France",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "Netherlands",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "Spain",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "Italy",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "Portugal",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "Ireland",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "Belgium",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "Austria",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "Lithuania",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "EMI hub",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "Estonia",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "Cyprus",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "Malta",
    "code": "EUR",
    "class": "Major",
    "perUsd": 0.8969,
    "perEur": 1,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "SEPA / SEPA Instant",
    "settlementTime": "Same day; instant ~10 s, 24/7",
    "notes": "",
    "flag": "🇪🇺",
    "defaultLpRate": 0.8969
  },
  {
    "country": "United Kingdom",
    "code": "GBP",
    "class": "Major",
    "perUsd": 0.7503,
    "perEur": 0.8366,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "Faster Payments / CHAPS",
    "settlementTime": "Seconds–2 h (FPS, to £1m); same day (CHAPS)",
    "notes": "UK financial-promotion rules",
    "flag": "🇬🇧",
    "defaultLpRate": 0.7503
  },
  {
    "country": "Switzerland",
    "code": "CHF",
    "class": "Liquid",
    "perUsd": 0.8286,
    "perEur": 0.9239,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "SIC",
    "settlementTime": "Same day",
    "notes": "",
    "flag": "🇨🇭",
    "defaultLpRate": 0.8286
  },
  {
    "country": "Czechia",
    "code": "CZK",
    "class": "Liquid",
    "perUsd": 21.8368,
    "perEur": 24.348,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "CERTIS / instant",
    "settlementTime": "Same day",
    "notes": "",
    "flag": "🇨🇿",
    "defaultLpRate": 21.8368
  },
  {
    "country": "Hungary",
    "code": "HUF",
    "class": "Liquid",
    "perUsd": 329.5785,
    "perEur": 367.48,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "AFR instant",
    "settlementTime": "Seconds",
    "notes": "",
    "flag": "🇭🇺",
    "defaultLpRate": 329.5785
  },
  {
    "country": "Romania",
    "code": "RON",
    "class": "Liquid",
    "perUsd": 4.7971,
    "perEur": 5.3488,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "Transfond / instant",
    "settlementTime": "Same day",
    "notes": "",
    "flag": "🇷🇴",
    "defaultLpRate": 4.7971
  },
  {
    "country": "Sweden",
    "code": "SEK",
    "class": "Liquid",
    "perUsd": 9.9368,
    "perEur": 11.0795,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "Bankgirot / Swish",
    "settlementTime": "Same day",
    "notes": "",
    "flag": "🇸🇪",
    "defaultLpRate": 9.9368
  },
  {
    "country": "Norway",
    "code": "NOK",
    "class": "Liquid",
    "perUsd": 9.317,
    "perEur": 10.3885,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "NICS",
    "settlementTime": "Same day",
    "notes": "",
    "flag": "🇳🇴",
    "defaultLpRate": 9.317
  },
  {
    "country": "Denmark",
    "code": "DKK",
    "class": "Liquid",
    "perUsd": 6.7033,
    "perEur": 7.4742,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "Straksclearing",
    "settlementTime": "Seconds",
    "notes": "",
    "flag": "🇩🇰",
    "defaultLpRate": 6.7033
  },
  {
    "country": "Iceland",
    "code": "ISK",
    "class": "Emerging",
    "perUsd": 122.3318,
    "perEur": 136.4,
    "fiatToCryptoTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "cryptoToFiatTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "fiatToFiatTiers": [
      1.2,
      0.9,
      0.75,
      0.6,
      0.5
    ],
    "rail": "Local transfer",
    "settlementTime": "1 business day",
    "notes": "",
    "flag": "🇮🇸",
    "defaultLpRate": 122.3318
  },
  {
    "country": "Turkey",
    "code": "TRY",
    "class": "Restricted",
    "perUsd": 49.7874,
    "perEur": 55.513,
    "fiatToCryptoTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "cryptoToFiatTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "fiatToFiatTiers": [
      2.5,
      2,
      1.75,
      1.5,
      1.25
    ],
    "rail": "FAST / EFT",
    "settlementTime": "Same day",
    "notes": "Indicative only, prefunding required",
    "flag": "🇹🇷",
    "defaultLpRate": 49.7874
  },
  {
    "country": "United States",
    "code": "USD",
    "class": "Major",
    "perUsd": 1,
    "perEur": 1.115,
    "fiatToCryptoTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "cryptoToFiatTiers": [
      0.35,
      0.25,
      0.2,
      0.15,
      0.1
    ],
    "fiatToFiatTiers": [
      0.35,
      0.25,
      0.18,
      0.12,
      0.08
    ],
    "rail": "Fedwire / ACH",
    "settlementTime": "Same day (Fedwire); 1–2 days (ACH)",
    "notes": "",
    "flag": "🇺🇸",
    "defaultLpRate": 1
  },
  {
    "country": "Canada",
    "code": "CAD",
    "class": "Liquid",
    "perUsd": 1.4023,
    "perEur": 1.5636,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "Interac / EFT",
    "settlementTime": "Same day; 1–2 days (EFT)",
    "notes": "",
    "flag": "🇨🇦",
    "defaultLpRate": 1.4023
  },
  {
    "country": "Mexico",
    "code": "MXN",
    "class": "Emerging",
    "perUsd": 18.6368,
    "perEur": 20.78,
    "fiatToCryptoTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "cryptoToFiatTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "fiatToFiatTiers": [
      1.2,
      0.9,
      0.75,
      0.6,
      0.5
    ],
    "rail": "SPEI",
    "settlementTime": "Seconds, 24/7",
    "notes": "",
    "flag": "🇲🇽",
    "defaultLpRate": 18.6368
  },
  {
    "country": "Brazil",
    "code": "BRL",
    "class": "Emerging",
    "perUsd": 5.3474,
    "perEur": 5.9624,
    "fiatToCryptoTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "cryptoToFiatTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "fiatToFiatTiers": [
      1.2,
      0.9,
      0.75,
      0.6,
      0.5
    ],
    "rail": "PIX",
    "settlementTime": "Seconds, 24/7",
    "notes": "",
    "flag": "🇧🇷",
    "defaultLpRate": 5.3474
  },
  {
    "country": "Argentina",
    "code": "ARS",
    "class": "Restricted",
    "perUsd": null,
    "perEur": null,
    "fiatToCryptoTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "cryptoToFiatTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "fiatToFiatTiers": [
      2.5,
      2,
      1.75,
      1.5,
      1.25
    ],
    "rail": "Transferencias 3.0",
    "settlementTime": "Seconds",
    "notes": "Settle at the rate you can actually access",
    "flag": "🇦🇷",
    "defaultLpRate": 1220
  },
  {
    "country": "United Arab Emirates",
    "code": "AED",
    "class": "Liquid",
    "perUsd": 3.6725,
    "perEur": 4.0948,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "UAEFTS / local transfer",
    "settlementTime": "Same day; Sun–Fri banking week",
    "notes": "Peg: price as USD plus rail cost",
    "flag": "🇦🇪",
    "defaultLpRate": 3.6725
  },
  {
    "country": "Saudi Arabia",
    "code": "SAR",
    "class": "Liquid",
    "perUsd": 3.75,
    "perEur": 4.1813,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "SARIE",
    "settlementTime": "Same day",
    "notes": "Peg",
    "flag": "🇸🇦",
    "defaultLpRate": 3.75
  },
  {
    "country": "Qatar",
    "code": "QAR",
    "class": "Liquid",
    "perUsd": 3.64,
    "perEur": 4.0586,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "QATCH",
    "settlementTime": "Same day",
    "notes": "Peg",
    "flag": "🇶🇦",
    "defaultLpRate": 3.64
  },
  {
    "country": "Bahrain",
    "code": "BHD",
    "class": "Liquid",
    "perUsd": 0.376,
    "perEur": 0.4192,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "Fawri / Fawri+",
    "settlementTime": "Seconds",
    "notes": "Peg",
    "flag": "🇧🇭",
    "defaultLpRate": 0.376
  },
  {
    "country": "Oman",
    "code": "OMR",
    "class": "Liquid",
    "perUsd": 0.3845,
    "perEur": 0.4287,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "Local transfer",
    "settlementTime": "Same day",
    "notes": "Peg",
    "flag": "🇴🇲",
    "defaultLpRate": 0.3845
  },
  {
    "country": "Kuwait",
    "code": "KWD",
    "class": "Liquid",
    "perUsd": null,
    "perEur": null,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "Local transfer",
    "settlementTime": "Same day",
    "notes": "Basket peg",
    "flag": "🇰🇼",
    "defaultLpRate": 0.3072
  },
  {
    "country": "Israel",
    "code": "ILS",
    "class": "Liquid",
    "perUsd": 3.0496,
    "perEur": 3.4003,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "Zahav / Masav",
    "settlementTime": "Same day",
    "notes": "",
    "flag": "🇮🇱",
    "defaultLpRate": 3.0496
  },
  {
    "country": "India",
    "code": "INR",
    "class": "Restricted",
    "perUsd": 95.1242,
    "perEur": 106.0635,
    "fiatToCryptoTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "cryptoToFiatTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "fiatToFiatTiers": [
      2.5,
      2,
      1.75,
      1.5,
      1.25
    ],
    "rail": "IMPS / NEFT via partner",
    "settlementTime": "Minutes via partner",
    "notes": "1% TDS and 30% gains tax drive a local USDT premium; indicative only",
    "flag": "🇮🇳",
    "defaultLpRate": 95.1242
  },
  {
    "country": "Singapore",
    "code": "SGD",
    "class": "Liquid",
    "perUsd": 1.2812,
    "perEur": 1.4285,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "FAST / PayNow",
    "settlementTime": "Seconds, 24/7",
    "notes": "",
    "flag": "🇸🇬",
    "defaultLpRate": 1.2812
  },
  {
    "country": "Hong Kong",
    "code": "HKD",
    "class": "Liquid",
    "perUsd": 7.8445,
    "perEur": 8.7466,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "FPS / CHATS",
    "settlementTime": "Seconds (FPS); same day (CHATS)",
    "notes": "",
    "flag": "🇭🇰",
    "defaultLpRate": 7.8445
  },
  {
    "country": "Japan",
    "code": "JPY",
    "class": "Liquid",
    "perUsd": 157.8206,
    "perEur": 175.97,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "Zengin",
    "settlementTime": "Same day",
    "notes": "",
    "flag": "🇯🇵",
    "defaultLpRate": 157.8206
  },
  {
    "country": "South Korea",
    "code": "KRW",
    "class": "Restricted",
    "perUsd": 1327.7489,
    "perEur": 1480.44,
    "fiatToCryptoTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "cryptoToFiatTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "fiatToFiatTiers": [
      2.5,
      2,
      1.75,
      1.5,
      1.25
    ],
    "rail": "Local transfer via partner",
    "settlementTime": "1 business day",
    "notes": "Capital controls",
    "flag": "🇰🇷",
    "defaultLpRate": 1327.7489
  },
  {
    "country": "China",
    "code": "CNY",
    "class": "Restricted",
    "perUsd": 6.6675,
    "perEur": 7.4343,
    "fiatToCryptoTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "cryptoToFiatTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "fiatToFiatTiers": [
      2.5,
      2,
      1.75,
      1.5,
      1.25
    ],
    "rail": "CIPS / local via partner",
    "settlementTime": "1–2 business days",
    "notes": "Onshore restrictions",
    "flag": "🇨🇳",
    "defaultLpRate": 6.6675
  },
  {
    "country": "Indonesia",
    "code": "IDR",
    "class": "Emerging",
    "perUsd": 18138.6009,
    "perEur": 20224.54,
    "fiatToCryptoTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "cryptoToFiatTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "fiatToFiatTiers": [
      1.2,
      0.9,
      0.75,
      0.6,
      0.5
    ],
    "rail": "BI-FAST",
    "settlementTime": "Seconds",
    "notes": "",
    "flag": "🇮🇩",
    "defaultLpRate": 18138.6009
  },
  {
    "country": "Philippines",
    "code": "PHP",
    "class": "Emerging",
    "perUsd": 63.9937,
    "perEur": 71.353,
    "fiatToCryptoTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "cryptoToFiatTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "fiatToFiatTiers": [
      1.2,
      0.9,
      0.75,
      0.6,
      0.5
    ],
    "rail": "InstaPay / PESONet",
    "settlementTime": "Seconds; same day",
    "notes": "",
    "flag": "🇵🇭",
    "defaultLpRate": 63.9937
  },
  {
    "country": "Thailand",
    "code": "THB",
    "class": "Emerging",
    "perUsd": 33.7704,
    "perEur": 37.654,
    "fiatToCryptoTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "cryptoToFiatTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "fiatToFiatTiers": [
      1.2,
      0.9,
      0.75,
      0.6,
      0.5
    ],
    "rail": "PromptPay",
    "settlementTime": "Seconds",
    "notes": "",
    "flag": "🇹🇭",
    "defaultLpRate": 33.7704
  },
  {
    "country": "Malaysia",
    "code": "MYR",
    "class": "Emerging",
    "perUsd": 4.089,
    "perEur": 4.5592,
    "fiatToCryptoTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "cryptoToFiatTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "fiatToFiatTiers": [
      1.2,
      0.9,
      0.75,
      0.6,
      0.5
    ],
    "rail": "DuitNow",
    "settlementTime": "Seconds",
    "notes": "",
    "flag": "🇲🇾",
    "defaultLpRate": 4.089
  },
  {
    "country": "Vietnam",
    "code": "VND",
    "class": "Restricted",
    "perUsd": null,
    "perEur": null,
    "fiatToCryptoTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "cryptoToFiatTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "fiatToFiatTiers": [
      2.5,
      2,
      1.75,
      1.5,
      1.25
    ],
    "rail": "NAPAS via partner",
    "settlementTime": "Same day",
    "notes": "",
    "flag": "🇻🇳",
    "defaultLpRate": 25420
  },
  {
    "country": "Pakistan",
    "code": "PKR",
    "class": "Restricted",
    "perUsd": null,
    "perEur": null,
    "fiatToCryptoTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "cryptoToFiatTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "fiatToFiatTiers": [
      2.5,
      2,
      1.75,
      1.5,
      1.25
    ],
    "rail": "Raast via partner",
    "settlementTime": "Same day",
    "notes": "",
    "flag": "🇵🇰",
    "defaultLpRate": 278.5
  },
  {
    "country": "Australia",
    "code": "AUD",
    "class": "Liquid",
    "perUsd": 1.4221,
    "perEur": 1.5856,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "NPP / PayID",
    "settlementTime": "Seconds, 24/7",
    "notes": "",
    "flag": "🇦🇺",
    "defaultLpRate": 1.4221
  },
  {
    "country": "New Zealand",
    "code": "NZD",
    "class": "Liquid",
    "perUsd": 1.7535,
    "perEur": 1.9552,
    "fiatToCryptoTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "cryptoToFiatTiers": [
      0.55,
      0.4,
      0.3,
      0.22,
      0.15
    ],
    "fiatToFiatTiers": [
      0.6,
      0.45,
      0.35,
      0.25,
      0.18
    ],
    "rail": "Local transfer",
    "settlementTime": "Same day",
    "notes": "",
    "flag": "🇳🇿",
    "defaultLpRate": 1.7535
  },
  {
    "country": "South Africa",
    "code": "ZAR",
    "class": "Emerging",
    "perUsd": 16.6487,
    "perEur": 18.5633,
    "fiatToCryptoTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "cryptoToFiatTiers": [
      1.25,
      1,
      0.8,
      0.65,
      0.5
    ],
    "fiatToFiatTiers": [
      1.2,
      0.9,
      0.75,
      0.6,
      0.5
    ],
    "rail": "RTC / EFT",
    "settlementTime": "Seconds; 1 day (EFT)",
    "notes": "",
    "flag": "🇿🇦",
    "defaultLpRate": 16.6487
  },
  {
    "country": "Nigeria",
    "code": "NGN",
    "class": "Restricted",
    "perUsd": null,
    "perEur": null,
    "fiatToCryptoTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "cryptoToFiatTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "fiatToFiatTiers": [
      2.5,
      2,
      1.75,
      1.5,
      1.25
    ],
    "rail": "NIP",
    "settlementTime": "Seconds",
    "notes": "Parallel-market rate; enter from LP",
    "flag": "🇳🇬",
    "defaultLpRate": 1650
  },
  {
    "country": "Kenya",
    "code": "KES",
    "class": "Restricted",
    "perUsd": null,
    "perEur": null,
    "fiatToCryptoTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "cryptoToFiatTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "fiatToFiatTiers": [
      2.5,
      2,
      1.75,
      1.5,
      1.25
    ],
    "rail": "M-Pesa / PesaLink",
    "settlementTime": "Seconds",
    "notes": "",
    "flag": "🇰🇪",
    "defaultLpRate": 129.5
  },
  {
    "country": "Egypt",
    "code": "EGP",
    "class": "Restricted",
    "perUsd": null,
    "perEur": null,
    "fiatToCryptoTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "cryptoToFiatTiers": [
      2.75,
      2.25,
      2,
      1.75,
      1.5
    ],
    "fiatToFiatTiers": [
      2.5,
      2,
      1.75,
      1.5,
      1.25
    ],
    "rail": "IPN / local transfer",
    "settlementTime": "Same day",
    "notes": "Enter rate from LP",
    "flag": "🇪🇬",
    "defaultLpRate": 48.9
  }
];

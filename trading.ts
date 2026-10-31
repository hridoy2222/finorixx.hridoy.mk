export type FeedStatus = 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED';

export interface MarketFeedState {
  provider: string;
  latencyMs: number;
  status: FeedStatus;
  lastTickTimestamp: number;
}

export interface SupportResistanceZone {
  id: string;
  type: 'SUPPORT' | 'RESISTANCE';
  priceLevel: number;
  strengthScore: number; // 0 - 100
  touchCount: number;
}

export interface CandleData {
  id: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  signalDirection?: 'BULLISH' | 'BEARISH' | 'DOJI';
}

export interface RiskConfiguration {
  maxTradeSizeUSD: number;
  dailyLossLimitUSD: number;
  maxConsecutiveLosses: number;
  requireExplicitConfirmation: boolean;
  activeBroker: 'QUOTEX' | 'POCKET_OPTION' | 'BINOMO' | 'NONE';
  brokerConnected: boolean;
}

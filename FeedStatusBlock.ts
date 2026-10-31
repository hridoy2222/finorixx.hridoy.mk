import { MarketFeedState } from '../types/trading';

export class FeedStatusBlock {
  private container: HTMLElement;
  private state: MarketFeedState;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;
    this.state = {
      provider: 'FINORIX-CORE-FEED-v4',
      latencyMs: 14,
      status: 'CONNECTED',
      lastTickTimestamp: Date.now()
    };
    this.render();
  }

  public updateFeed(latencyMs: number, status: MarketFeedState['status']) {
    this.state.latencyMs = latencyMs;
    this.state.status = status;
    this.state.lastTickTimestamp = Date.now();
    this.render();
  }

  private render() {
    const statusColor =
      this.state.status === 'CONNECTED'
        ? '#00FF9D'
        : this.state.status === 'RECONNECTING'
        ? '#FFB800'
        : '#FF3366';

    this.container.innerHTML = `
      <div class="feed-status-card" style="
        background: #121824;
        border: 1px solid rgba(0, 240, 255, 0.2);
        border-radius: 8px;
        padding: 16px;
        font-family: 'JetBrains Mono', monospace;
        color: #F8FAFC;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div>
          <div style="font-size: 0.75rem; color: #94A3B8; letter-spacing: 0.05em;">DATA STREAM TELEMETRY</div>
          <div style="font-size: 0.95rem; font-weight: 600; margin-top: 4px;">${this.state.provider}</div>
        </div>
        <div style="display: flex; gap: 20px; align-items: center;">
          <div>
            <div style="font-size: 0.7rem; color: #94A3B8;">LATENCY</div>
            <div style="font-size: 0.9rem; color: #00F0FF;">${this.state.latencyMs} ms</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; color: #94A3B8;">STATUS</div>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: ${statusColor}; box-shadow: 0 0 8px ${statusColor};"></span>
              <span style="font-size: 0.85rem; font-weight: 700; color: ${statusColor};">${this.state.status}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

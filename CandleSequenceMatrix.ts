import { CandleData } from '../types/trading';

export class CandleSequenceMatrix {
  private container: HTMLElement;
  private sequence: CandleData[] = [];

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;
  }

  public pushCandle(candle: CandleData) {
    this.sequence.push(candle);
    if (this.sequence.length > 3) {
      this.sequence.shift();
    }
    this.render();
  }

  private render() {
    const cardsHTML = this.sequence
      .map((c, idx) => {
        const isBullish = c.close >= c.open;
        const color = isBullish ? '#00FF9D' : '#FF3366';
        return `
          <div style="
            flex: 1;
            background: #0A0E17;
            border: 1px solid rgba(0, 240, 255, 0.15);
            border-radius: 6px;
            padding: 12px;
            font-family: 'JetBrains Mono', monospace;
          ">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #94A3B8;">
              <span>CANDLE #${idx + 1}</span>
              <span style="color: ${color}; font-weight: 700;">${isBullish ? 'BULL' : 'BEAR'}</span>
            </div>
            <div style="margin-top: 10px; font-size: 0.8rem; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <div><span style="color:#64748B;">O:</span> ${c.open.toFixed(5)}</div>
              <div><span style="color:#64748B;">H:</span> ${c.high.toFixed(5)}</div>
              <div><span style="color:#64748B;">L:</span> ${c.low.toFixed(5)}</div>
              <div><span style="color:#64748B;">C:</span> ${c.close.toFixed(5)}</div>
            </div>
          </div>
        `;
      })
      .join('');

    this.container.innerHTML = `
      <div style="background: #121824; border: 1px solid rgba(0,240,255,0.2); border-radius: 8px; padding: 16px;">
        <div style="font-size: 0.75rem; color: #94A3B8; font-family: 'JetBrains Mono'; margin-bottom: 12px;">
          3-CANDLE SEQUENCE LOG MATRIX
        </div>
        <div style="display: flex; gap: 12px;">
          ${cardsHTML}
        </div>
      </div>
    `;
  }
}

import { RiskConfiguration } from '../types/trading';

export class SafeConfigPanel {
  private container: HTMLElement;
  private config: RiskConfiguration;
  private onConfigChange: (cfg: RiskConfiguration) => void;

  constructor(containerId: string, onChange: (cfg: RiskConfiguration) => void) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;
    this.onConfigChange = onChange;
    this.config = {
      maxTradeSizeUSD: 50,
      dailyLossLimitUSD: 250,
      maxConsecutiveLosses: 3,
      requireExplicitConfirmation: true,
      activeBroker: 'NONE',
      brokerConnected: false
    };
    this.render();
    this.bindEvents();
  }

  private bindEvents() {
    this.container.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      if (!target) return;

      if (target.id === 'maxTradeSizeUSD') {
        this.config.maxTradeSizeUSD = Number(target.value);
      } else if (target.id === 'dailyLossLimitUSD') {
        this.config.dailyLossLimitUSD = Number(target.value);
      } else if (target.id === 'brokerSelect') {
        this.config.activeBroker = target.value as RiskConfiguration['activeBroker'];
        this.config.brokerConnected = target.value !== 'NONE';
      } else if (target.id === 'requireExplicitConfirmation') {
        this.config.requireExplicitConfirmation = (target as HTMLInputElement).checked;
      }

      this.onConfigChange(this.config);
    });

    this.container.addEventListener('click', (e) => {
      const btn = e.target as HTMLElement;
      if (btn.id === 'verifyAndExecuteBtn') {
        this.executeSafeOrderWithVerification();
      }
    });
  }

  private executeSafeOrderWithVerification() {
    if (!this.config.brokerConnected || this.config.activeBroker === 'NONE') {
      alert('SAFETY LOCK: Select and connect a broker platform before signal simulation.');
      return;
    }

    if (this.config.requireExplicitConfirmation) {
      const confirmed = window.confirm(
        `FINORIX PRO - EXPLICIT VERIFICATION REQUIRED\n\n` +
          `Broker: ${this.config.activeBroker}\n` +
          `Max Trade Size: $${this.config.maxTradeSizeUSD} USD\n` +
          `Daily Loss Guard: $${this.config.dailyLossLimitUSD} USD\n\n` +
          `Confirm execution of simulated risk-checked order?`
      );
      if (!confirmed) return;
    }

    console.info('[FINORIX PRO] Order passed safety validation. Executing sandboxed order on', this.config.activeBroker);
    alert(`Sandboxed trade validated and logged for broker: ${this.config.activeBroker} (No live capital risked).`);
  }

  private render() {
    this.container.innerHTML = `
      <div style="background: #121824; border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 8px; padding: 16px; font-family: 'JetBrains Mono', monospace; color: #F8FAFC;">
        <div style="font-size: 0.85rem; font-weight: 700; color: #00F0FF; margin-bottom: 14px;">
          RISK & BROKER GATEWAY CONTROL
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label style="font-size: 0.75rem; color: #94A3B8; display: block; margin-bottom: 4px;">BROKER CONNECTOR (SANDBOX / READ-ONLY)</label>
            <select id="brokerSelect" style="width: 100%; background: #0A0E17; color: #F8FAFC; border: 1px: rgba(0,240,255,0.3); padding: 8px; border-radius: 4px;">
              <option value="NONE" ${this.config.activeBroker === 'NONE' ? 'selected' : ''}>-- Disconnected --</option>
              <option value="QUOTEX" ${this.config.activeBroker === 'QUOTEX' ? 'selected' : ''}>Quotex (Simulated API)</option>
              <option value="POCKET_OPTION" ${this.config.activeBroker === 'POCKET_OPTION' ? 'selected' : ''}>Pocket Option (Simulated API)</option>
              <option value="BINOMO" ${this.config.activeBroker === 'BINOMO' ? 'selected' : ''}>Binomo (Simulated API)</option>
            </select>
          </div>

          <div>
            <label style="font-size: 0.75rem; color: #94A3B8; display: block; margin-bottom: 4px;">MAX TRADE SIZE (USD)</label>
            <input type="number" id="maxTradeSizeUSD" value="${this.config.maxTradeSizeUSD}" style="width: 100%; background: #0A0E17; color: #F8FAFC; border: 1px solid rgba(0,240,255,0.2); padding: 8px; border-radius: 4px;" />
          </div>

          <div>
            <label style="font-size: 0.75rem; color: #94A3B8; display: block; margin-bottom: 4px;">DAILY LOSS LIMIT (USD)</label>
            <input type="number" id="dailyLossLimitUSD" value="${this.config.dailyLossLimitUSD}" style="width: 100%; background: #0A0E17; color: #F8FAFC; border: 1px solid rgba(0,240,255,0.2); padding: 8px; border-radius: 4px;" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
            <input type="checkbox" id="requireExplicitConfirmation" ${this.config.requireExplicitConfirmation ? 'checked' : ''} />
            <label for="requireExplicitConfirmation" style="font-size: 0.75rem; color: #CBD5E1;">Require 2-Step Explicit Modal Verification</label>
          </div>

          <button id="verifyAndExecuteBtn" style="
            margin-top: 8px;
            background: linear-gradient(135deg, #00F0FF 0%, #0077FF 100%);
            color: #0A0E17;
            font-weight: 700;
            padding: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            letter-spacing: 0.05em;
          ">
            TEST VERIFIED SIGNAL ORDER
          </button>
        </div>
      </div>
    `;
  }
}

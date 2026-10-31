import { SupportResistanceZone } from '../types/trading';

export class SupportResistanceEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private zones: SupportResistanceZone[] = [];

  constructor(canvasId: string) {
    const el = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!el) throw new Error(`Canvas #${canvasId} not found`);
    this.canvas = el;
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('2D context not available');
    this.ctx = context;
  }

  public setZones(zones: SupportResistanceZone[]) {
    this.zones = zones;
    this.draw();
  }

  public draw(currentPrice: number = 1.0845) {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    // Draw background grid lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    // Plot zones
    this.zones.forEach((zone) => {
      const yNorm = height * 0.5 - (zone.priceLevel - currentPrice) * 1500;
      const isSupport = zone.type === 'SUPPORT';
      const color = isSupport ? '0, 255, 157' : '255, 51, 102';

      this.ctx.strokeStyle = `rgba(${color}, 0.7)`;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.moveTo(0, yNorm);
      this.ctx.lineTo(width, yNorm);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      this.ctx.fillStyle = `rgba(${color}, 0.15)`;
      this.ctx.fillRect(0, yNorm - 6, width, 12);

      this.ctx.fillStyle = '#F8FAFC';
      this.ctx.font = '11px "JetBrains Mono", monospace';
      this.ctx.fillText(
        `${zone.type} [${zone.priceLevel.toFixed(5)}] - Strength: ${zone.strengthScore}%`,
        12,
        yNorm - 8
      );
    });
  }
}

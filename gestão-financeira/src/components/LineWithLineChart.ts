import { createTypedChart } from 'vue-chartjs'
import {
  LineController,
  Chart,
  Tooltip,
  Legend,
  Title,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Plugin
} from 'chart.js'

// 1. Registrar componentes padrão do Chart.js
Chart.register(
  LineController,
  Tooltip,
  Legend,
  Title,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement
);

// --- 2. CONTROLLER CUSTOMIZADO (Linha Vertical) ---
class LineWithLineController extends LineController {

  static override id = 'line-with-line';

  public override draw() {

    super.draw();


    if (this.chart?.tooltip?.opacity && this.chart.tooltip.opacity > 0) {
      const ctx = this.chart.ctx;


      const x = this.chart.tooltip.caretX;
      const topY = this.chart.scales.y.top;
      const bottomY = this.chart.scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#07C';
      ctx.stroke();
      ctx.restore();
    }
  }
}


export const chartAreaBackgroundPlugin: Plugin = {
  id: 'chartAreaBackground',
  beforeDraw: (chart) => {
    if (!chart.chartArea) {
      return;
    }

    const { ctx, chartArea: { top, left, width, height } } = chart;

    ctx.save();
    ctx.fillStyle = '#333333'; // Fundo Cinza Escuro
    ctx.fillRect(left, top, width, height);
    ctx.restore();
  }
};


Chart.register(LineWithLineController, chartAreaBackgroundPlugin);


const LineWithLineChart = createTypedChart(
  'line-with-line' as 'line',
  LineWithLineController
);

export default LineWithLineChart;

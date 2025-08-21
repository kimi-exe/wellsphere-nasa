// Chart.js setup and configuration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register all Chart.js components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Default chart options for consistency
export const defaultChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: 'white',
        padding: 20
      }
    },
    title: {
      color: 'white',
      font: {
        size: 16
      }
    }
  },
  scales: {
    x: {
      ticks: { color: 'white' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' }
    },
    y: {
      ticks: { color: 'white' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' }
    }
  }
};

// Radar chart specific options
export const radarChartOptions = {
  responsive: true,
  scales: {
    r: {
      angleLines: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      pointLabels: {
        color: 'white'
      },
      ticks: {
        color: 'white',
        backdropColor: 'transparent'
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: 'white'
      }
    },
    title: {
      color: 'white',
      font: {
        size: 16
      }
    }
  }
};

export default ChartJS;
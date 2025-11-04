import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const ScatterChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500">No data available</div>;
  }

  const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
  ];

  const chartData = {
    datasets: data.map((dietData, index) => ({
      label: dietData.diet_type,
      data: dietData.data,
      backgroundColor: colors[index % colors.length],
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Protein vs Carbs Relationship',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Carbs (g)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Protein (g)',
        },
      },
    },
  };

  return <Scatter data={chartData} options={options} />;
};

export default ScatterChart;

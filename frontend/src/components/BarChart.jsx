import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500">No data available</div>;
  }

  const chartData = {
    labels: data.map(item => item.Diet_type),
    datasets: [
      {
        label: 'Protein (g)',
        data: data.map(item => item['Protein(g)']),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Carbs (g)',
        data: data.map(item => item['Carbs(g)']),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Fat (g)',
        data: data.map(item => item['Fat(g)']),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
    ],
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
        text: 'Average Macronutrients by Diet Type',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;

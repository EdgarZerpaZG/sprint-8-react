import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type LineChartProps = {
  labels: string[];
  data: number[];
  title: string;
};

export const options = (title: string) => ({
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: title,
    },
  },
});

export default function LineChart({ labels, data, title }: LineChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Users",
        data,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return <Bar options={options(title)} data={chartData} />;
}
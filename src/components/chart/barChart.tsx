import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type BarChartProps = {
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

export default function BarChart({ labels, data, title }: BarChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Users",
        data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.3)",
      },
    ],
  };

  return <Line options={options(title)} data={chartData} />;
}
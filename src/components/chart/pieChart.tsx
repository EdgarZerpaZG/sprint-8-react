import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  labels: string[];
  data: number[];
  title?: string;
};

export function PieChart({ labels, data, title }: PieChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Users",
        data,
        backgroundColor: [
          "rgba(34, 197, 94, 0.4)", // verde
          "rgba(148, 163, 184, 0.4)", // gris
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(148, 163, 184, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: !!title,
        text: title || "",
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}
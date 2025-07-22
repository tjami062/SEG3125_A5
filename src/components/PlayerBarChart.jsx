import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

function PlayerBarChart({ players }) {
  const data = {
    labels: players.map(p => p.name),
    datasets: [
      {
        label: "Goals",
        data: players.map(p => p.goals),
        backgroundColor: "#4f81bd",
      },
      {
        label: "Assists",
        data: players.map(p => p.assists),
        backgroundColor: "#f79646",
      },
      {
        label: "Points",
        data: players.map(p => p.points),
        backgroundColor: "#c0504d",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default PlayerBarChart;
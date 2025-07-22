import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card
} from "react-bootstrap";
import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import Navbar from "../components/Navbar";
import "../styles/Players.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ChartTooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

const statOptions = {
  wins: "Wins",
  savePctg: "Save %",
  shutouts: "Shutouts",
};

const Goalies = () => {
  const [goalies, setGoalies] = useState([]);
  const [selectedStat, setSelectedStat] = useState("wins");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = `https://api-web.nhle.com/v1/goalie-stats-leaders/current`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        const data = await res.json();
        const filtered = data[selectedStat] || [];
        setGoalies(filtered);
      } catch (error) {
        console.error("Failed to fetch goalie stats:", error);
      }
    };
    fetchStats();
  }, [selectedStat]);

  const chartData = {
    labels: goalies.map((p) => `${p.firstName.default} ${p.lastName.default}`),
    datasets: [
      {
        label: statOptions[selectedStat],
        data: goalies.map((p) => parseFloat(p.value).toFixed(2)),
        backgroundColor: "#28a745",
        borderRadius: 6,
      },
    ],
  };

  const renderRadarData = (goalie) => {
    return {
      labels: ["Wins", "Save %", "Shutouts"],
      datasets: [
        {
          label: `${goalie.firstName.default} ${goalie.lastName.default}`,
          data: [
            parseFloat(goalie.stats?.wins || 0).toFixed(2),
            parseFloat(goalie.stats?.savePctg || 0).toFixed(2),
            parseFloat(goalie.stats?.shutouts || 0).toFixed(2),
          ],
          backgroundColor: "rgba(40, 167, 69, 0.2)",
          borderColor: "#28a745",
          borderWidth: 2,
        },
      ],
    };
  };

  return (
    <div className="players-page">
      <Navbar />
      <Container className="py-5">
        <h2 className="mb-4 text-center fw-bold display-5 border-bottom pb-3">
          NHL Goalie Leaderboard – {statOptions[selectedStat]}
        </h2>

        <div className="d-flex justify-content-center mb-4">
          <Form.Select
            value={selectedStat}
            onChange={(e) => setSelectedStat(e.target.value)}
            className="w-auto px-3 py-2 rounded shadow-sm"
          >
            {Object.entries(statOptions).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="chart-container mb-5 mx-auto bg-white rounded shadow p-4">
          <Bar data={chartData} />
        </div>

        <Row className="g-4 justify-content-center">
          {goalies.map((player) => (
            <Col key={player.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="text-center h-100 player-card position-relative">
                <Card.Body>
                  <img
                    src={player.headshot}
                    alt={player.lastName.default}
                    className="headshot mb-3"
                  />
                  <Card.Title className="fw-bold">
                    {player.firstName.default} {player.lastName.default}
                  </Card.Title>
                  <Card.Text className="text-muted mb-2">
                    {player.teamName.default}
                  </Card.Text>
                  <img
                    src={player.teamLogo}
                    alt="team"
                    className="team-logo mb-3"
                  />
                  <p className="mb-0">
                    {statOptions[selectedStat]}: <strong>{parseFloat(player.value).toFixed(2)}</strong>
                  </p>

                  <div className="radar-chart-container mt-3">
                    <Radar
                      data={renderRadarData(player)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            suggestedMin: 0,
                            suggestedMax: selectedStat === "savePctg" ? 1 : undefined,
                          },
                        },
                        plugins: {
                          legend: { display: false },
                        },
                      }}
                      height={300}
                      width={300}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Goalies;

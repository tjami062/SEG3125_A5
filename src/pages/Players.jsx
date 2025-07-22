import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Navbar from "../components/Navbar";
import "../styles/Players.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const statOptions = {
  goals: "Goals",
  assists: "Assists",
  plusMinus: "Plus/Minus",
  goalsPp: "Powerplay Goals",
};

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [selectedStat, setSelectedStat] = useState("goals");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
          "https://api-web.nhle.com/v1/skater-stats-leaders/current"
        )}`;
        const res = await fetch(proxyUrl);
        const data = await res.json();
        setPlayers(data[selectedStat] || []);
      } catch (error) {
        console.error("Failed to fetch player stats:", error);
      }
    };
    fetchStats();
  }, [selectedStat]);

  const chartData = {
    labels: players.map((p) => `${p.firstName.default} ${p.lastName.default}`),
    datasets: [
      {
        label: statOptions[selectedStat],
        data: players.map((p) => p.value),
        backgroundColor: "#004080",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="players-page">
      <Navbar />
      <Container className="py-5">
        <h2 className="mb-4 text-center fw-bold display-4 border-bottom border-3 pb-3">
          NHL Stats Leaders – {statOptions[selectedStat]}
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

        <div className="chart-container mb-5 mx-auto bg-white rounded shadow-sm p-4 border">
          <Bar data={chartData} />
        </div>

        <Row className="g-4 justify-content-center">
          {players.map((player) => (
            <Col key={player.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="player-card border-0 shadow-sm h-100">
                <Card.Body className="d-flex flex-column align-items-center">
                  <img
                    src={player.headshot}
                    alt={player.lastName.default}
                    className="headshot mb-3"
                  />
                  <Card.Title className="fw-bold text-center">
                    {player.firstName.default} {player.lastName.default}
                  </Card.Title>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <img
                      src={player.teamLogo}
                      alt={player.teamAbbrev}
                      className="team-logo"
                    />
                    <Card.Text className="text-muted mb-0">
                      {player.teamName.default} ({player.teamAbbrev})
                    </Card.Text>
                  </div>
                  <Badge bg="primary" pill className="px-3 py-2 mt-auto">
                    {statOptions[selectedStat]}: {player.value}
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Players;

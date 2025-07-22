import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend
} from "chart.js";
import Navbar from "../components/Navbar";
import "../styles/Players.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ChartTooltip,
  Legend
);

const statOptions = {
  wins: "Wins",
  points: "Points",
  goalsPerGame: "Goals/Game",
  goalsAgainstPerGame: "GA/Game"
};

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [selectedStat, setSelectedStat] = useState("wins");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const proxyUrl = "https://corsproxy.io/?";
        const nhlUrl = encodeURIComponent("https://api-web.nhle.com/v1/standings/now");
        const url = `${proxyUrl}${nhlUrl}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        const allTeamRecords = [];
        if (Array.isArray(data.standings)) {
          for (const region of data.standings) {
            if (Array.isArray(region.teamRecords)) {
              for (const s of region.teamRecords) {
                allTeamRecords.push({
                  teamName: s?.team?.name?.default || "Unknown",
                  teamAbbrev: s?.team?.abbrev || "UNK",
                  wins: s?.stats?.wins ?? 0,
                  points: s?.stats?.points ?? 0,
                  goalsPerGame: s?.stats?.goalsForPerGame ?? 0,
                  goalsAgainstPerGame: s?.stats?.goalsAgainstPerGame ?? 0
                });
              }
            }
          }
        }

        setTeams(allTeamRecords);
      } catch (error) {
        console.error("Failed to fetch team stats:", error);
      }
    };
    fetchStats();
  }, []);

  const getStatValue = (team) => {
    switch (selectedStat) {
      case "wins":
        return team?.wins ?? 0;
      case "points":
        return team?.points ?? 0;
      case "goalsPerGame":
        return team?.goalsPerGame ?? 0;
      case "goalsAgainstPerGame":
        return team?.goalsAgainstPerGame ?? 0;
      default:
        return 0;
    }
  };

  const chartData = {
    labels: teams.map((team) => team?.teamName || "Unknown"),
    datasets: [
      {
        label: statOptions[selectedStat],
        data: teams.map((team) => parseFloat(getStatValue(team))),
        backgroundColor: "#007bff",
        borderRadius: 6
      }
    ]
  };

  return (
    <div className="players-page">
      <Navbar />
      <Container className="py-5">
        <h2 className="mb-4 text-center fw-bold display-5 border-bottom pb-3">
          NHL Team Leaderboard – {statOptions[selectedStat]}
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
          {teams.map((team, index) => {
            const teamName = team?.teamName || "Unknown";
            const teamAbbrev = team?.teamAbbrev || `team-${index}`;
            const statValue = parseFloat(getStatValue(team)).toFixed(2);

            return (
              <Col key={`${teamAbbrev}-${index}`} xs={12} sm={6} md={4} lg={3}>
                <Card className="text-center h-100 player-card">
                  <Card.Body>
                    <Card.Title className="fw-bold">{teamName}</Card.Title>
                    <img
                      src={`https://assets.nhle.com/logos/nhl/svg/${teamAbbrev}_light.svg`}
                      alt="team logo"
                      className="team-logo mb-3"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <p className="mb-0">
                      {statOptions[selectedStat]}: <strong>{statValue}</strong>
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default Teams;

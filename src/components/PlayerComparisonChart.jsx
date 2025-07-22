import React, { useEffect, useState } from 'react';

function App() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("https://api-web.nhle.com/v1/skater-stats-leaders/current")
      .then(res => res.json())
      .then(data => {
        console.log("API Response:", data);

        if (data?.points?.length > 0) {
          const top3 = data.points.slice(0, 3).map(p => ({
            name: `${p.firstName.default} ${p.lastName.default}`,
            goals: p.goals,
            assists: p.assists,
            points: p.points,
          }));
          setPlayers(top3);
        }
      })
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test NHL Data</h1>
      <ul>
        {players.map(p => (
          <li key={p.name}>
            <strong>{p.name}</strong>: {p.goals} G / {p.assists} A / {p.points} PTS
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
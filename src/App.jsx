import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", color: "#fff" }}>
        <h1>🏒 Welcome to the NHL Stats Dashboard</h1>
        <p>Explore player, goalie, and team leaderboards for the 2024–2025 season.</p>
      </div>
    </>
  );
};

export default App;